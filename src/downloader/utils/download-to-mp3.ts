import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { join } from 'path'
import Downloader from 'nodejs-file-downloader'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
if (!ffmpegPath) throw new Error('ffmpeg path is required')
ffmpeg.setFfmpegPath(ffmpegPath)

const savedPath = join(process.cwd(), 'temp')
export const downloadToMp3 = async (
	url: string,
	fileName: string
): Promise<string> => {
	const dest = join(savedPath, fileName)
	if (existsSync(dest)) return dest
	const downloader = new Downloader({ url, directory: savedPath })
	try {
		const { filePath } = await downloader.download()
		if (!filePath) return ''
		return new Promise<string>((resolve) => {
			ffmpeg(filePath!)
				.audioCodec('libmp3lame')
				.format('mp3')
				.audioQuality(2)
				.on('end', () => {
					unlink(filePath)
					resolve(dest)
				})
				.save(dest)
				.on('error', () => resolve(''))
		})
	} catch (error) {
		return ''
	}
}
