import { type RemoveOptions, type UpdateOptions } from 'nedb'
export type RemoveAsync = <T>(
	query: T,
	options: RemoveOptions
) => Promise<number>
export type InsertAsync = <T>(newDoc: any) => Promise<T>

export type UpdateAsync = <T>(
	query: T,
	updateQuery: T,
	options: UpdateOptions
) => Promise<number>

export type FindAsync = <T>(query: any, projection: any) => Promise<Array<T>>
export type FindOneAsync = <T>(query: any, projection: any) => Promise<T>
