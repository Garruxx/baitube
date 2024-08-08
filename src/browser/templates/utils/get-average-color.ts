import sharp from 'sharp'
export const getAverageColor = async (buffer: Buffer | null) => {
	if (!buffer) return `rgb(93,39,181)`
	try {
		const { data } = await sharp(buffer)
			.resize(1, 1)
			.raw()
			.toBuffer({ resolveWithObject: true })
		const [red, gree, blue] = data
		return `rgb(${red},${gree},${blue})`
	} catch (error) {
		return `rgb(93,39,181)`
	}
}
