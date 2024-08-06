import type { proto } from '@whiskeysockets/baileys'
import type { sendMessage } from '../types/send-message.type'

export const reaction = (
	sendMessage: sendMessage,
	from: string,
	key: proto.IMessageKey,
	reaction: string
) => {
	sendMessage(from, {
		react: {
			key,
			text: reaction,
		},
	})
}
