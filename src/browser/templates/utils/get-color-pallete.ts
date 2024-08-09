import vibrant from 'node-vibrant'
export const getColorPallete = async (img: Buffer | null) => {
	const base = {
		bg: '#E6D8EE',
		color: '#2E2B30',
		title_color: '#C676F4',
		vibrant: '#C676F4',
	}
	if (!img) return base
	try {
		const pallete = await vibrant.from(img!).getPalette()

		return {
			bg: pallete.Vibrant?.hex || base.bg,
			color: pallete.Vibrant?.bodyTextColor || base.color,
			title_color: pallete.DarkMuted?.hex || base.title_color,
			vibrant: pallete.Vibrant?.hex || base.vibrant,
		}
	} catch (error) {
		console.log(error)

		return base
	}
}
