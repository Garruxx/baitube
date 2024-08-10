import ytdl from '@distube/ytdl-core'
import { logger } from './logger/logger'
import { Whatsapp } from './whatsapp/whatsapp'
import * as Baileys from '@whiskeysockets/baileys'
import { Downloader } from './downloader/downloader'
import { YTBrowser } from './browser/yt-browser'
import { messageSimplifier } from './utils/message-simplifier'
import { musicCard } from './browser/templates/music/music-card'
import { config } from 'dotenv'
config()
if (!process.env.YT_KATZE_URL) throw new Error('env YT_KATZE_URL is required')

const whatsapp = new Whatsapp('base', Baileys, logger as any)
const downloader = new Downloader(whatsapp, ytdl, logger)
new YTBrowser(
	process.env.YT_KATZE_URL,
	whatsapp,
	messageSimplifier,
	musicCard,
	downloader.saveMessageSongData.bind(downloader),
	logger
)

whatsapp.start()
