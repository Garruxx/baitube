import type { proto, WASocket } from '@whiskeysockets/baileys'

export const reaction = (
	sock: WASocket,
	from: string,
	key: proto.IMessageKey,
	reaction: string
) => {
	sock.sendMessage(from, {
		react: {
			key,
			text: reaction,
		},
	})
}
