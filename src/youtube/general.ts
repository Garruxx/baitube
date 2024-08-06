import { generalSearchQuery } from './queries/general.gql'
import { sendSongResult } from './utils/send-song'
import { sendBestMatch } from './utils/send-best-result'
import type { proto, WASocket } from '@whiskeysockets/baileys'
import { reaction } from './utils/reaction'
export const GeneralSearch = async (
	{ content, from }: { content: string; from: string },
	sock: WASocket,
	key: proto.IMessageKey
) => {
	if (!content) return
	const user_query = content.match(/YT(.*)YT/)?.[1]
	if (!user_query || /descargar/i.test(user_query)) return

	try {
		reaction(sock, from, key, '🔎')
		sock.sendPresenceUpdate('composing', from)
		const rawResult = await fetch('http://localhost:2222/graphql', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: generalSearchQuery(user_query) }),
		})
		const baseResult = await rawResult.json()
		const result = baseResult?.data?.general
		const songs = result?.tracks?.songs
		let currentSend = songs?.length - 1
		const resend = async () => {
			await sendSongResult(songs[currentSend], from, sock)
			currentSend--
			if (currentSend >= 0) await resend()
		}

		await resend()
		await sendBestMatch(result?.bestMatch, from, sock)
		reaction(sock, from, key, '⭐')
	} catch (error) {
		console.log(error)
	}
}
