export const shortStr = (text: string) => {
	return text.length >= 18 ? text.substring(0, 18).padEnd(21, '.') : text
}
