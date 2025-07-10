import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'
import { EventEmitter } from 'events'
import * as QRCode from 'qrcode'
import open from 'open'
import { logger } from '../logger/logger'

// QR code event emitter
export const qrEmitter = new EventEmitter()

// Start the server
let server: http.Server | null = null

// Start the QR server
export function startServer(port: number = 3000): void {
	if (server) return // Already started

	// Create HTTP server
	server = http.createServer((req, res) => {
		if (!req.url) {
			res.writeHead(404)
			res.end('Not found')
			return
		}

		// Handle API requests inline for now
		if (
			req.url?.startsWith('/qr-data') ||
			req.url?.startsWith('/connection-status')
		) {
			handleApiRequestInline(req, res)
			return // API request handled
		}

		// Basic routing for static files
		const requestPath = req.url === '/' ? '/index.html' : req.url
		const filePath = path.join(process.cwd(), 'src/www', requestPath)

		fs.readFile(filePath, (error, content) => {
			if (error) {
				res.writeHead(404)
				res.end('File not found')
				return
			}

			const extname = path.extname(filePath)
			const contentType =
				{
					'.html': 'text/html',
					'.js': 'text/javascript',
					'.css': 'text/css',
					'.png': 'image/png',
					'.jpg': 'image/jpeg',
				}[extname] || 'text/plain'

			res.writeHead(200, { 'Content-Type': contentType })
			res.end(content)
		})
	})

	// Start listening
	server.listen(port, async () => {
		const url = `http://localhost:${port}/`
		logger.info(`QR Code server running at ${url}`)

		// Open browser automatically
		try {
			logger.info('Opening browser automatically...')
			await open(url)
		} catch (err) {
            // Moradito 
            console.log(`\x1b[31mError opening browser: ${url}\x1b[0m`)
			logger.error('Error opening browser:', err)
		}
	})
}

// Update QR code
export async function updateQR(qrData: string): Promise<void> {
	logger.info('QR code received, updating UI')
	try {
		// Convert WhatsApp QR code string to a proper data URL using qrcode library
		const qrDataURL = await QRCode.toDataURL(qrData)
		// Extract the base64 part
		const base64Data = qrDataURL.split(',')[1]
		lastQrData = base64Data // Store only the base64 part
		qrEmitter.emit('qrCode', base64Data) // Emit event for any listeners
		logger.info('QR code updated successfully')
	} catch (error) {
		console.error('Error generating QR code:', error)
	}
}

// Update connection status
export function updateConnectionStatus(connected: boolean): void {
	if (connected) {
		logger.info(
			'Whatsapp connection established, marking as connected'
		)
	}
	isConnected = connected // Actualizar directamente
	qrEmitter.emit('connectionStatus', connected)
}

// Store the latest data (moved here to avoid circular dependencies)
let lastQrData: string = ''
let isConnected: boolean = false

// Set up listeners for our own events
qrEmitter.on('qrCode', (qrData: string) => {
	lastQrData = qrData
})

qrEmitter.on('connectionStatus', (connected: boolean) => {
	isConnected = connected
})

// Function to handle API requests inline
function handleApiRequestInline(
	req: http.IncomingMessage,
	res: http.ServerResponse
): void {
	if (req.url?.startsWith('/qr-data')) {
		// Send QR data
		res.writeHead(200, { 'Content-Type': 'text/html' })
		if (lastQrData) {
			logger.info('Serving QR code to client')
			res.end(
				`<img src="data:image/png;base64,${lastQrData}" alt="QR Code" width="256" height="256">`
			)
		} else {
			logger.info('No QR code available yet')
			res.end(`
        <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
          <div style="font-size: 18px; color: #075E54; margin-bottom: 10px;">WWaiting for QR code...</div>
          <div style="font-size: 14px; color: #777;">The QR code will appear here when it's available</div>
          <div style="margin-top: 20px;">
            <div class="loader" style="border: 5px solid #f3f3f3; border-radius: 50%; border-top: 5px solid #128C7E; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 0 auto;"></div>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>
          </div>
        </div>
      `) // No QR yet
		}
	} else if (req.url?.startsWith('/connection-status')) {
		// Send connection status
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ connected: isConnected }))
	}
}
