import { getInfo, filterFormats, chooseFormat } from '@distube/ytdl-core'
import type { sendMessage } from '../youtube/types/send-message.type'
import { getVideoInfo } from './utils/get-video-info'
import type { proto, WASocket } from '@whiskeysockets/baileys'
import { reaction } from '../youtube/utils/reaction'
import { downloadToMp3 } from './utils/download-to-mp3'
const downloadSongRegex = /descargar (canci(o|ó)n|audio)/i
export const DownloadSong = async (
	{ content, from }: { content: string; from: string },
	socket: WASocket,
	key: proto.IMessageKey,
	quoted: string = ''
) => {
	if (!downloadSongRegex.test(content)) return
	const { artists, videoID, videoName } = getVideoInfo(quoted)
	const isAudio = content.includes('audio')
	if (!videoID) return
	socket.sendPresenceUpdate('recording', from)
	reaction(socket, from, key, '⏳')

	const info = await getInfo(videoID)
	const audioFormats = filterFormats(info.formats, 'audioandvideo')
	const url = isAudio
		? audioFormats[0].url
		: await downloadToMp3(audioFormats[0].url, videoID + '.mp3')

	if (!url) return reaction(socket, from, key, '😢')

	const fileType = isAudio ? { audio: { url } } : { document: { url } }
	await socket.sendMessage(from, {
		...fileType,
		title: videoName,
		mimetype: isAudio ? 'audio/mp4' : 'audio/mp3',
		fileName: `${artists} • ${videoName}.mp3`,
		ptt: isAudio,
	})
	reaction(socket, from, key, '💿')
}
