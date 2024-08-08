import type { proto } from '@whiskeysockets/baileys'

export type YTBrowserMessageSimplifier = (message: proto.IWebMessageInfo) => {
	key: proto.IMessageKey
	quoted?: string | null
	content?: string | null
	from?: string | null
}
