export interface Song {
	title: string
	id: string
	watchId: string
	duration: string
	thumbnails: Array<{
		url: string
	}>
	artists: Array<{
		name: string
	}>
}
