import pino from 'pino'

export const transport = pino.transport({
	targets: [
		{
			target: 'pino-pretty',
			level: 'info',
			options: {
				destination: 'logs/info.log',
			},
		},
		{
			target: 'pino-pretty',
			level: 'error',
			options: {
				destination: 'logs/error.log',
			},
		},
		{
			target: 'pino-pretty',
			level: 'faltal',
			options: {
				destination: 'logs/fatal.log',
			},
		},
		{
			target: 'pino-pretty',
			level: 'warn',
			options: {
				destination: 'logs/warn.log',
			},
		},
		{
			target: 'pino-pretty',
			level: 'debug',
			options: {
				destination: 'logs/debug.log',
			},
		},
		{
			target: 'pino-pretty',
			level: 'trace',
			options: {
				destination: 'logs/trace.log',
			},
		},
	],
})

export const logger = pino(transport)
