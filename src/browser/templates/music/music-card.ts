import sharp from 'sharp'
import type { Song } from '../../types/song.type'
import musicTemplate from './music-card.svg'
import musicCardText from './music-card-text.txt'
import musicCardTextAlt from './music-alternative-card.txt'
import { getAverageColor } from '../utils/get-average-color'
import { URLToB64AndBuffer } from '../utils/url-to-b64-and-buffer'

export const musicCard = async ({
	id,
	artists,
	duration,
	title,
	watchId,
}: Song) => {
	const songID = id || watchId
	const artist = artists.map((a) => a.name).join(', ')
	const imgURL = `https://i.ytimg.com/vi/${songID}/2.jpg`
	try {
		const [imgB64, buffer] = await URLToB64AndBuffer(imgURL)
		const background = await getAverageColor(buffer)
		const svgImage = musicTemplate
			.replace('$artist', artist)
			.replace('$title', title)
			.replace('$duration', duration)
			.replace('$image', imgB64)
			.replace('$bg', background)
		const image = await sharp(Buffer.from(svgImage))
			.resize(360, 150)
			.png()
			.toBuffer()
		const text = musicCardText
			.replace('$id', songID)
			.replace('$artist', artist)
			.replace('$title', title)

		return { image, text }
	} catch (error) {
		const text = musicCardTextAlt
			.replace('$title', title)
			.replace('$id', songID)
			.replace('$artist', artist)
			.replace('$duration', duration)
		return { image: null, text }
	}
}
