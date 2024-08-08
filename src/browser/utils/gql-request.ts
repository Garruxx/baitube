import type { Logger } from 'pino'

export class gqlRequest {
	constructor(private gqlURL: string, private logger: Logger) {}
	async gqlService<T>(query: string): Promise<T | null> {
		try {
			const rawEstult = await fetch(this.gqlURL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query }),
			})
			return await rawEstult.json()
		} catch (error) {
			this.logger.fatal(error, 'file to fetch Grapqh request')
			return null
		}
	}
}
