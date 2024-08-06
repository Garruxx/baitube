import { getInfo, filterFormats, chooseFormat } from '@distube/ytdl-core'
import type { sendMessage } from '../youtube/types/send-message.type'
import { getVideoInfo } from './utils/get-video-info'
import type { proto } from '@whiskeysockets/baileys'
import { reaction } from '../youtube/utils/reaction'
const downloadVideoRegex = /descargar v(i|í)deo/i

export const DownloadVideo = async (
	{ content, from }: { content: string; from: string },
	sendMessage: sendMessage,
	key: proto.IMessageKey,
	quoted: string = ''
) => {
	if (!downloadVideoRegex.test(content)) return
	const { artists, videoID, videoName } = getVideoInfo(quoted)
	if (!videoID) return
	reaction(sendMessage, from, key, '⏳')
	const info = await getInfo(videoID)
	const audioFormats = filterFormats(info.formats, 'audioandvideo')
	const mp4 = chooseFormat(audioFormats, {
		filter: (format) => format.container === 'mp4',
	})

	if (mp4) {
		await sendMessage(from, {
			video: { url: mp4.url },
			fileName: `${artists} • ${videoName}`,
		})
		reaction(sendMessage, from, key, '📼')
	}
}
