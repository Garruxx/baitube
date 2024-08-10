import { proto, type WASocket } from '@whiskeysockets/baileys'
import type { Whatsapp } from '../whatsapp/whatsapp'
import type { Logger } from 'pino'
import type { FileInfo } from './types/downloader.type'
import type Ytdl from '@distube/ytdl-core'
import { LocalDB } from './database/local-db'
import { join } from 'path'
import { downloadToMp3 } from './utils/download-to-mp3'
import type { Song } from '../browser/types/song.type'

export class Downloader extends LocalDB {
	private conection: WASocket | null = null
	constructor(
		private whatsapp: Whatsapp,
		private ytdl: typeof Ytdl,
		private logger: Logger
	) {
		super({
			filename: join(process.cwd(), 'nedb', 'database.db'),
			autoload: true,
		})

		whatsapp.onready = (conection) => {
			conection.ev.on('messages.upsert', ({ messages }) => {
				this.init(messages[0])
				this.conection = conection
			})
		}
	}

	private async init({ message }: proto.IWebMessageInfo) {
		const react = message?.reactionMessage?.text
		const key = message?.reactionMessage?.key
		const messageID = key?.id
		const to = key?.remoteJid
		if (!key || !to) return
		if (!/(👍|😂|❤️)/.test(react || '')) return
		try {
			const quoted = await this.findOneAsync<FileInfo>({ messageID })
			if (!quoted) return
			else {
				await this.reaction(key, '⏳')
				const [format] = await this.getFormats(quoted.YTKey)
				if (!format.url) return this.reaction(key, '🥹')
				this.whatsapp.recordering(to)
				react == '👍' && (await this.sendAudio(to, format.url, quoted))
				react == '😂' && (await this.sendSong(to, format.url, quoted))
				react == '❤️' && (await this.sendVideo(to, format.url, quoted))
				this.reaction(key!, '📩')
				this.whatsapp.normalState(to)
			}
		} catch (error) {
			this.logger.error(error)
			this.reaction(key!, '😭')
			this.whatsapp.normalState(to)
		}
	}

	private async sendSong(to: string, url: string, fileInfo: FileInfo) {
		const fileName = fileInfo.title + '.mp3'
		const path = await downloadToMp3(url, fileInfo.YTKey + '.mp3')
		return await this.whatsapp.conection?.sendMessage(to, {
			document: { url: path },
			title: fileInfo.title,
			mimetype: 'audio/mp3',
			fileName,
		})
	}
	private async sendAudio(to: string, url: string, fileInfo: FileInfo) {
		const fileName = fileInfo + '.mp3'
		return await this.whatsapp.conection?.sendMessage(to, {
			audio: { url },
			title: fileInfo.title,
			mimetype: 'audio/mp4',
			fileName,
		})
	}
	private async sendVideo(to: string, url: string, fileInfo: FileInfo) {
		const fileName = fileInfo + '.mp3'
		return await this.whatsapp.conection?.sendMessage(to, {
			video: { url },
			title: fileInfo.title,
			mimetype: 'video/mp4',
			fileName,
		})
	}

	private async getFormats(key: string) {
		const info = await this.ytdl.getInfo(key)
		return this.ytdl.filterFormats(info.formats, 'audioandvideo')
	}

	private async reaction(key: proto.IMessageKey, text: string) {
		if (!key.remoteJid) return
		return await this.conection?.sendMessage(key.remoteJid, {
			react: { text, key },
		})
	}

	public saveMessageSongData(id: string, song: Song) {
		if (!id) return
		let artist = song.artists.map((a) => a.name).join(', ')
		artist ??= 'Desconocido'
		const expiresAt = new Date()
		expiresAt.setHours(expiresAt.getHours() + 44)

		const data: FileInfo = {
			messageID: id,
			YTKey: song.id || song.watchId,
			title: song.title + ' • ' + (artist || 'desconocido'),
			expiresAt,
		}
		this.insertAsync(data)
	}
}
