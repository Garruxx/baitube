import { join } from 'path'
import {
	useMultiFileAuthState,
	makeWASocket,
	type WASocket,
} from '@whiskeysockets/baileys'
import { GeneralSearch } from './youtube/general'
import { DownloadVideo } from './downloader/download-video'
import { DownloadSong } from './downloader/donwload-song'
import { rm } from 'fs/promises'
useMultiFileAuthState('tokens/garrux-s').then(({ state, saveCreds }) => {
	const sock: WASocket = makeWASocket({
		printQRInTerminal: true,
		auth: state,
	})

	sock.logger.level = 'error'
	sock.ev.on('creds.update', saveCreds)
	sock.ev.on('messages.upsert', ({ messages }) => {
		const ephemeralMessage = messages?.[0]?.message?.ephemeralMessage
		const extendedText = messages?.[0]?.message?.extendedTextMessage
		const quotedMessage = extendedText?.contextInfo?.quotedMessage
		const key = messages[0]?.key
		const quoted = quotedMessage?.imageMessage?.caption
		let content = ephemeralMessage?.message?.extendedTextMessage?.text
		content ??= extendedText?.text
		content ??= messages[0].message?.conversation
		const from = messages?.[0]?.key?.remoteJid
		if (!from || !content) return

		GeneralSearch({ content, from }, sock, key)
		DownloadVideo({ content, from }, sock, key, quoted!)
		DownloadSong({ content, from }, sock, key, quoted!)
	})
})

setInterval(() => {
	rm(join(process.cwd(), 'temp'), {
		recursive: true,
		retryDelay: 20000,
	})
}, 1000 * 60 * 60 * 22)
