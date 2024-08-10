import NeDB from 'nedb'
import { logger } from '../../logger/logger'
import util from 'util'
import type {
	FindAsync,
	FindOneAsync,
	InsertAsync,
	RemoveAsync,
	UpdateAsync,
} from './types/database.types'

export class LocalDB extends NeDB {
	removeAsync: RemoveAsync
	insertAsync: InsertAsync
	updateAsync: UpdateAsync
	findAsync: FindAsync
	findOneAsync: FindOneAsync
	constructor(pathOrOptions?: string | Nedb.DataStoreOptions) {
		super(pathOrOptions)
		this.removeAsync = util.promisify(this.remove.bind(this))
		this.insertAsync = util.promisify(this.insert.bind(this))
		this.updateAsync = util.promisify(this.update.bind(this))
		this.findAsync = util.promisify(this.find.bind(this))
		this.findOneAsync = util.promisify(this.findOne.bind(this))

		setInterval(() => this.removeExpiredDocuments(), 60000)
	}

	removeExpiredDocuments() {
		const now = new Date()
		this.remove({ expiresAt: { $lt: now } }, { multi: true }, (error) => {
			logger.error(error, 'Error removing expired documents:')
			this.persistence.compactDatafile()
		})
	}
}
