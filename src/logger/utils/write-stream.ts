import { createWriteStream } from 'fs'
import { Transform } from 'stream'

export const writeStream = (path: string) => {
	const stream = createWriteStream(path)
	return new Transform({
		transform(chunk, _encoding, callback) {
			const log = JSON.parse(chunk.toString())
			if (
				log?.class != 'baileys' &&
				!log?.err?.message?.includes('Unknown message type')
			) {
				stream.write(chunk)
			}
		},
	})
}
