const videoIDRegex = /https:\/\/youtu.be\/(\S*)/i
const artistsRegex = /\*Artistas?\*:\s(.*)/i
const videoNameRegex = /\*Nombre\*:\s(.*)/i

export const getVideoInfo = (text: string) => {
	const videoID = videoIDRegex.exec(text)?.[1]
	const artists = artistsRegex.exec(text)?.[1]
	const videoName = videoNameRegex.exec(text)?.[1]
	return { videoID, artists, videoName }
}
