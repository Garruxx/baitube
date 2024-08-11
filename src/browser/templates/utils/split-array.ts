export const splitArray = (arr: Array<any> | Buffer, size: number) => {
	const result = []
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size))
	}
	return result
}
