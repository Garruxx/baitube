import * as Baileys from '@whiskeysockets/baileys'
import type { Logger } from '@whiskeysockets/baileys/node_modules/pino'
export class Whatsapp {
	private sessionName: string = 'tokens/default'
	public conection: Baileys.WASocket | null = null
	public conectionState: Partial<Baileys.ConnectionState> | null = null
	private isEnd = false
	private closedMessage = 'Whatsapp conection closed'

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

	async start(socketConfig: Baileys.UserFacingSocketConfig = {} as any) {
		try {
			const { saveCreds, state } = await this.getAuth()
			this.conection = this.baileys.makeWASocket({
				printQRInTerminal: true,
				browser: this.baileys.Browsers.macOS('Desktop'),
				logger: this.logger,

				...socketConfig,
				auth: socketConfig.auth || state,
			})
			this.conection.ev.on('creds.update', saveCreds)
			this.conection.ev.on('connection.update', (state) => {
				this.logger?.trace(state, 'Conection status')
				this.logger?.info(state, 'Conection status')
				this.logger?.error(new Error('sdds'), 'Conection status')
				this.logger?.fatal(state, 'Conection status')
				this.conectionState = state
				if (state.connection != 'close') return
				if (this.isEnd) {
					console.log(`\x1b[41m${this.closedMessage}\x1b[0m`)
				}
				!this.isEnd && this.reconnect()
			})
		} catch (error) {
			this.logger?.error(error, 'Start conecctions')
		}
	}

	end() {
		this.isEnd = true
		this.conection?.end(undefined)
	}

	writing(id: string) {
		try {
			return this.conection?.sendPresenceUpdate('composing', id)
		} catch (error) {
			this.logger?.error(error, 'Update precense to writing')
		}
	}
	recordering(id: string) {
		try {
			return this.conection?.sendPresenceUpdate('recording', id)
		} catch (error) {
			this.logger?.error(error, 'Update precense to recordering')
		}
	}
	normalState(id: string) {
		try {
			return this.conection?.sendPresenceUpdate('available', id)
		} catch (error) {
			this.logger?.error(error, 'Update precense to normal state')
		}
	}

	seenMessage({ key }: Baileys.proto.IWebMessageInfo) {
		try {
			return this.conection?.readMessages([key])
		} catch (error) {
			this.logger?.error(error)
		}
	}
	private reconnect(
		socketConfig: Baileys.UserFacingSocketConfig = {} as any
	) {
		this.start(socketConfig)
		this.logger?.info('Re-attempting to connect to whatsapp')
	}
}
