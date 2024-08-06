import { join } from 'path'
import { useMultiFileAuthState, makeWASocket } from '@whiskeysockets/baileys'
import { GeneralSearch } from './youtube/general'
import type { sendMessage } from './youtube/types/send-message.type'
import { DownloadVideo } from './downloader/download-video'
import { DownloadSong } from './downloader/donwload-song'
import { rm } from 'fs/promises'
useMultiFileAuthState('tokens/auth_main').then(({ state, saveCreds }) => {
	const sock = makeWASocket({
		printQRInTerminal: true,
		auth: state,
	})

	const sendMessage: sendMessage = async (...t) => {
		return await sock.sendMessage(...t)
	}

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

		const from = messages?.[0]?.key?.remoteJid
		if (!from || !content) return

		GeneralSearch({ content, from }, sendMessage, key)
		DownloadVideo({ content, from }, sendMessage, key, quoted!)
		DownloadSong({ content, from }, sendMessage, key, quoted!)
	})
})

setInterval(() => {
	rm(join(process.cwd(), 'temp'), {
		recursive: true,
		retryDelay: 20000,
	})
}, 1000 * 60 * 60 * 22)
