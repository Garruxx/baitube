import type { proto } from '@whiskeysockets/baileys'

export type MessageReactionExtractor = (
	message: proto.IWebMessageInfo
) => string

export type FileInfo = {
	messageID: string
	YTKey: string
	title: string
    expiresAt: Date
}
