import ytdl from '@distube/ytdl-core'
import { generalSearchQuery } from './queries/general.gql'
import type { sendMessage } from './types/send-message.type'
import { sendSongResult } from './utils/send-song'
import { sendBestMatch } from './utils/send-best-result'
import type { proto } from '@whiskeysockets/baileys'
import { reaction } from './utils/reaction'
export const GeneralSearch = async (
	{ content, from }: { content: string; from: string },
	sendMessage: sendMessage,
	key: proto.IMessageKey
) => {
	if (!content) return
	const user_query = content.match(/YT(.*)YT/)?.[1]
	if (!user_query || /descargar/.test(user_query)) return

	try {
		reaction(sendMessage, from, key, '🔎')
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
			await sendSongResult(songs[currentSend], from, sendMessage)
			currentSend--
			if (currentSend >= 0) await resend()
		}

		await resend()
		await sendBestMatch(result?.bestMatch, from, sendMessage)
		reaction(sendMessage, from, key, '⭐')

	} catch (error) {
		console.log(error)
	}
}
