import { logger } from '../../../logger/logger'

export const URLToB64AndBuffer = async (
	url: string
): Promise<[string, Buffer | null]> => {
	try {
		const res = await fetch(url)
		const buffer = Buffer.from(await res.arrayBuffer())
		const b64 = buffer.toString('base64')
		return [`data:${res.headers.get('content-type')};base64,${b64}`, buffer]
	} catch (error) {
		logger.warn(error, 'URLToB64 error')
		return [
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAHUlEQVR4nGP8//8/A27AhEeO3tI+jM3IXMYBdDkAggAG3Q+B83YAAAAASUVORK5CYII=',
			null,
		]
	}
}
