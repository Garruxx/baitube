import type {
	AnyMessageContent,
	MiscMessageGenerationOptions,
	proto,
} from '@whiskeysockets/baileys'

export type sendMessage = (
	jid: string,
	content: AnyMessageContent,
	options?: MiscMessageGenerationOptions
) => Promise<proto.WebMessageInfo | undefined>
