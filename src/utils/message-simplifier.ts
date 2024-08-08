import type { proto } from '@whiskeysockets/baileys'

export const messageSimplifier = ({ key, message }: proto.IWebMessageInfo) => {
	const content =
		message?.conversation ||
		message?.extendedTextMessage?.text ||
		message?.ephemeralMessage?.message?.extendedTextMessage?.text
	const quotedMessage =
		message?.extendedTextMessage?.contextInfo?.quotedMessage ||
		message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo
			?.quotedMessage
	const quoted =
		quotedMessage?.imageMessage?.caption ||
		quotedMessage?.conversation ||
		quotedMessage?.videoMessage?.caption

	return {
		key,
		quoted,
		content,
		from: key.remoteJid,
	}
}
