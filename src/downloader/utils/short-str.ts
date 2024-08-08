export const shortStr = (text: string) => {
	return text.length >= 22 ? text.substring(0, 22).padEnd(25, '.') : text
}
