import type { Song } from './song.type'

interface BestMatch extends Song {
	type: 'song' | 'album' | 'artist'
}
export interface YTBrowserMusicResults {
	data: {
		general: {
			bestMatch: BestMatch
			tracks: {
				songs: Array<Song>
				continuation: {
					params: string
					query: string
				}
			}
			visitorId: string
		}
	}
}
