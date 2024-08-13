import { Whatsapp } from './../whatsapp/whatsapp'
import type { Logger } from 'pino'
import queryMusic from './graphql/general-music.gql'
import { gqlRequest } from './graphql/gql-request'
import helpMessage from './assets/help-message.txt'
import type { proto, WASocket } from '@whiskeysockets/baileys'
import type { YTBrowserMessageSimplifier } from './types/yt-browser-message-simplifier.type'
import type { YTBrowserMusicResults } from './types/yt-browser-music-results.type'
import type { YTBrowserMusicTemplate } from './types/yt-browser-music-template.type'
import type { Song } from './types/song.type'

export class YTBrowser extends gqlRequest {
	private queryRegex = /!yt (.*)/i
	private infoRegex = /!!yt (-i|help|ayuda|info|-h)/
	private conection: WASocket | null = null
	constructor(
		graphqlURL: string,
		private whatsapp: Whatsapp,
		private messageSimplifier: YTBrowserMessageSimplifier,
		private musicTemplate: YTBrowserMusicTemplate,
		private onSongMessage: (messageID: string, song: Song) => void,
		logger: Logger
	) {
		super(graphqlURL, logger)
		whatsapp.onready = (conection) => {
			conection.ev.on('messages.upsert', ({ messages }) => {
				this.init(messages)
				this.conection = conection
			})
		}
	}

	private async init([message]: proto.IWebMessageInfo[]) {
		const { key, content, from } = this.messageSimplifier(message)
		const [text, makeTarget] = this.getIsMakeATarget(content)
		if (!text || !from || !key) return
		const query = this.extractQueryFromMessage(text, from)
		if (!query) return

		try {
			this.whatsapp.seenMessage({ key })
			const results = await this.getMusic(query, key)
			await this.sendResults(results, from, makeTarget)
			await this.reaction(key, '📝')
		} catch (error) {
			await this.whatsapp.normalState(from)
			await this.reaction(key, '😭')
		}
	}

	private extractQueryFromMessage(
		message: string = '',
		from: string
	): string {
		if (this.infoRegex.test(message)) {
			this.conection?.sendMessage(from, {
				text: helpMessage,
			})
			return ''
		}
		const [query] = this.queryRegex.exec(message) || ['']
		return query
	}

	async getMusic(
		user_query: string,
		key: proto.IMessageKey
	): Promise<YTBrowserMusicResults | null> {
		if (!user_query) return null
		await this.whatsapp.writing(key.remoteJid!)
		await this.reaction(key, '🔎')
		const query = queryMusic.replace('$query', user_query)
		return await this.gqlService<YTBrowserMusicResults>(query)
	}

	private async sendResults(
		results: YTBrowserMusicResults | null,
		from: string,
		makeTarget: boolean = false
	) {
		const bestMathc = results?.data.general.bestMatch
		const songs = results?.data.general.tracks.songs || []
		if (bestMathc && bestMathc.type == 'song') songs.push(bestMathc)

		for (const song of songs.reverse()) {
			const { image, text } = await this.musicTemplate(song, makeTarget)
			let sent = null
			if (!image) sent = await this.conection?.sendMessage(from, { text })
			else {
				sent = await this.conection?.sendMessage(from, {
					image,
					caption: text,
				})
			}
			this.onSongMessage(sent?.key.id!, song)
		}
	}

	private async reaction(key: proto.IMessageKey, text: string) {
		if (!key.remoteJid) return
		return await this.conection?.sendMessage(key.remoteJid, {
			react: { text, key },
		})
	}

	private getIsMakeATarget(content?: string | null): [string, boolean] {
		const text = content
		if (!text) return ['', false]
		if (!text.includes('-t')) {
			return [text, false]
		}
		if (text.includes('-t')) {
			return [text.replace('-t', ''), true]
		}
		return ['', false]
	}
}
