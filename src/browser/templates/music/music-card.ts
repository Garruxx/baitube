import sharp from 'sharp'
import type { Song } from '../../types/song.type'
import musicTemplate from './music-card.svg'
import musicCardText from './music-card-text.txt'
import musicCardTextAlt from './music-alternative-card.txt'
import { URLToB64AndBuffer } from '../utils/url-to-b64-and-buffer'
import { shortStr } from '../../utils/short-str'
import { setVarsToDoc } from '../../utils/set-vars-to-doc'
import { getColorPallete } from '../utils/get-color-pallete'
import { adjustImageLHURL } from '../../utils/adjust-img-url'

export const musicCard = async (
	{ id, artists, duration, title, watchId, thumbnails }: Song,
	makeATarget = false
) => {
	id ??= watchId
	const imgURL = adjustImageLHURL(thumbnails[0].url)
	let artist = artists.map((a) => a.name).join(', ') || 'Desconocido'
	const docVars = { title, artist, duration, id }
	const text = setVarsToDoc(musicCardTextAlt, docVars)
	if (!makeATarget) return { text }

	try {
		const [imgB64, buffer] = await URLToB64AndBuffer(imgURL)
		const pallete = await getColorPallete(buffer)
		const targetVars = {
			image: imgB64,
			...pallete,
			title: shortStr(title),
			artist: shortStr(artist),
			duration,
		}
		const svg = setVarsToDoc(musicTemplate, targetVars)
		const text = setVarsToDoc(musicCardText, docVars)
		const image = await sharp(Buffer.from(svg))
			.resize(360, 150)
			.png()
			.toBuffer()
		return { image, text }
	} catch (error) {
		return { text }
	}
}
