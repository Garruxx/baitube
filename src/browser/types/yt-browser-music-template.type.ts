import type { Song } from './song.type'

export type YTBrowserMusicTemplate = (
	song: Song,
	makeATarget?: boolean
) => Promise<{
	image?: Buffer | null
	text: string
}>
