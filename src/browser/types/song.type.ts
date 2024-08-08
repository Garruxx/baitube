export interface Song {
	title: string
	id: string
	watchId: string
	duration: string
	artists: Array<{
		name: string
	}>
}
