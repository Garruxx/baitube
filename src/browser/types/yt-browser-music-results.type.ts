export interface YTBrowserMusicResults {
	data: {
		general: {
			bestMatch: {
				artists: Array<{
					name: string
				}>
				duration: string
				id: string
				title: string
				watchId: string
				type: 'song' | 'album' | 'artist'
			}
			tracks: {
				songs: Array<{
					artists: Array<{
						name: string
					}>
					duration: string
					id: string
					watchId: string
					title: string
				}>
				continuation: {
					params: string
					query: string
				}
			}
			visitorId: string
		}
	}
}
