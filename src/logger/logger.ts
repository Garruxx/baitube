import pino, {
	type MultiStreamOptions,
	type StreamEntry,
	multistream,
} from 'pino'
import { writeStream } from './utils/write-stream'
import { mkdir } from 'fs/promises'

const opts: MultiStreamOptions = {
	levels: {
		silent: Infinity,
		fatal: 60,
		error: 50,
		warn: 40,
		info: 30,
		debug: 20,
		trace: 10,
	},
	dedupe: true,
}
const stream: Array<StreamEntry<pino.Level>> = [
	{ level: 'info', stream: writeStream('logs/info.log') },
	{ level: 'debug', stream: writeStream('logs/debug.log') },
	{ level: 'error', stream: writeStream('logs/error.log') },
	{ level: 'fatal', stream: writeStream('logs/fatal.log') },
	{ level: 'info', stream: writeStream('logs/info.log') },
	{ level: 'trace', stream: writeStream('logs/trace.log') },
	{ level: 'warn', stream: writeStream('logs/warn.log') },
]

const logger = pino({}, multistream(stream, opts))
mkdir('logs', { recursive: true }).catch(logger.error)
export { logger }
