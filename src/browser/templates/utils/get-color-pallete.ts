import sharp from 'sharp'
import quantize, { type RgbPixel } from 'quantize'
import { getContrastingColor } from './get-contrasting-color'
import { splitArray } from './split-array'
import { logger } from '../../../logger/logger'
const base = {
	bg: '#E6D8EE',
	color: '#2E2B30',
	title_color: '#C676F4',
	vibrant: '#C676F4',
}
export const getColorPallete = async (img: Buffer | null) => {
	if (!img) return base
	try {
		const pxs = await sharp(img).raw().toBuffer({ resolveWithObject: true })
		const rgbArray = splitArray(pxs.data, 3) as RgbPixel[]
		const colorMap = quantize(rgbArray, 2)
		if (!colorMap) return base
		const pallete = colorMap.palette()
		const color = `rgb(${getContrastingColor(pallete[0]).join(',')}`
		const vibrant = `rgb(${getContrastingColor(pallete[1]).join(',')}`
		const title_color = `rgb(${pallete[1].join(',')}`
		const bg = `rgb(${pallete[0].join(',')}`
		return { bg, color, title_color, vibrant }
	} catch (error) {
		logger.error(error)
		return base
	}
}
