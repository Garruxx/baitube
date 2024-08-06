import type { BestResult } from '../types/best-result.type'
import type { sendMessage } from '../types/send-message.type'
import { sendSongResult } from './send-song'

export const sendBestMatch = (
	best: BestResult,
	to: string,
	sendMessage: sendMessage
) => {
	if (best?.type != 'song') return
	return sendSongResult(best, to, sendMessage)
}
