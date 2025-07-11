import * as Baileys from '@whiskeysockets/baileys'
import type { Logger } from 'pino'
import qr from 'qrcode-terminal'
import { updateQR, updateConnectionStatus, startServer } from '../www'
import { rm, existsSync } from 'fs'
import { promisify } from 'util'

const rmAsync = promisify(rm);
export class Whatsapp {
	private sessionName: string = 'tokens/default'
	public conection: Baileys.WASocket | null = null
	public conectionState: Partial<Baileys.ConnectionState> | null = null
	private isEnd = false
	private onReady: Array<(conection: Baileys.WASocket) => void> = []
	constructor(
		sessionName: string = 'default',
		private baileys: typeof Baileys,
		private logger?: Logger
	) {
		this.sessionName = 'tokens/' + sessionName
	}

	private async getAuth() {
		try {
			return await this.baileys.useMultiFileAuthState(this.sessionName)
		} catch (error) {
			this.logger?.fatal(error)
			throw error
		}
	}

	// Method to clear session tokens
	private async clearSessionTokens(): Promise<void> {
		try {
			if (existsSync(this.sessionName)) {
				await rmAsync(this.sessionName, { recursive: true, force: true })
				this.logger?.info(`Session tokens removed: ${this.sessionName}`)
				
				// Reset UI state when tokens are cleared
				if (process.env.PRINT_QR_ON_WEB) {
					updateConnectionStatus(false)
				}
			}
		} catch (error) {
			this.logger?.error(error, 'Error removing session tokens')
		}
	}

	set onready(cb: (conection: Baileys.WASocket) => void) {
		if (this.conectionState?.connection == 'open') cb(this.conection!)
		this.onReady.push(cb)
	}

	async start(socketConfig: Baileys.UserFacingSocketConfig = {} as any) {
		try {
			const { saveCreds, state } = await this.getAuth()
			this.conection = this.baileys.makeWASocket({
				printQRInTerminal: false,

				browser: this.baileys.Browsers.macOS('Desktop'),
				logger: this.logger,

				...socketConfig,
				auth: socketConfig.auth || state,
			})
			this.conection.ev.on('creds.update', saveCreds)
			this.conection.ev.on('connection.update', async (state) => {
				this.logger?.trace(state, 'Connection status')
				this.conectionState = state

				// If there's a QR code, update the UI
				if (state.qr && process.env.PRINT_QR_ON_TERMINAL) {
					qr.generate(state.qr)
				}

				if (state.qr && process.env.PRINT_QR_ON_WEB) {
					startServer()
					// Pass the QR string to be converted to a proper QR image
					updateQR(state.qr)
					// When receiving a new QR, ensure it's not marked as connected
					updateConnectionStatus(false)
				}
				// Show connection status in console
				if (state.connection) {
					this.logger?.info(
						'WhatsApp connection status:',
						state.connection
					)
				}

				// Only mark as connected when the connection is fully established
				if (state.connection === 'open') {
					this.logger?.info(
						'WhatsApp connection established completely!'
					)
					// Small delay to ensure everything is ready
					setTimeout(() => {
						this.onReady.forEach((cb) => cb(this.conection!))
						if (process.env.PRINT_QR_ON_WEB) {
							updateConnectionStatus(true)
						}
					}, 1000)
				}

				// Handle connection closure
				if (state.connection === 'close') {
					const lastDisconnect = state.lastDisconnect
					const statusCode = (lastDisconnect?.error as any)?.output?.statusCode
					
					this.logger?.warn(`Connection closed. Code: ${statusCode}`)
					
					// If the session was closed from the phone (logged out)
					if (statusCode === Baileys.DisconnectReason.loggedOut) {
						this.logger?.info('User logged out from phone. Removing tokens...')
						await this.clearSessionTokens()
						
						// Restart connection after clearing tokens
						if (!this.isEnd) {
							this.logger?.info('Starting new connection after logout...')
							setTimeout(() => {
								this.reconnect()
							}, 2000)
						}
						return
					}
					
					// If it's a bad session, also clear tokens
					if (statusCode === Baileys.DisconnectReason.badSession) {
						this.logger?.info('Invalid session. Removing tokens...')
						await this.clearSessionTokens()
						
						if (!this.isEnd) {
							this.logger?.info('Starting new connection after bad session...')
							setTimeout(() => {
								this.reconnect()
							}, 2000)
						}
						return
					}
					
					// If it's not a logout or bad session, try to reconnect normally
					if (!this.isEnd) {
						this.reconnect()
					}
					return
				}
			})
		} catch (error) {
			this.logger?.error(error, 'Start connections')
		}
	}

	end() {
		this.isEnd = true
		this.conection?.end(undefined)
	}

	// Public method to manually clear session
	async clearSession(): Promise<void> {
		await this.clearSessionTokens()
		this.logger?.info('Session cleared manually')
	}

	async writing(id: string) {
		try {
			return await this.conection?.sendPresenceUpdate('composing', id)
		} catch (error) {
			this.logger?.error(error, 'Update presence to writing')
		}
	}
	recordering(id: string) {
		try {
			return this.conection?.sendPresenceUpdate('recording', id)
		} catch (error) {
			this.logger?.error(error, 'Update presence to recording')
		}
	}
	normalState(id: string) {
		try {
			return this.conection?.sendPresenceUpdate('available', id)
		} catch (error) {
			this.logger?.error(error, 'Update presence to normal state')
		}
	}

	async seenMessage({ key }: Baileys.proto.IWebMessageInfo) {
		try {
			return await this.conection?.readMessages([key])
		} catch (error) {
			this.logger?.error(error)
		}
	}
	private reconnect(
		socketConfig: Baileys.UserFacingSocketConfig = {} as any
	) {
		// Close previous connection if it exists
		if (this.conection) {
			this.conection.end(undefined)
			this.conection = null
		}
		
		this.start(socketConfig)
		this.logger?.info('Re-attempting to connect to WhatsApp')
	}
}
