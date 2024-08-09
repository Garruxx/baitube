export const setVarsToDoc = (text: string, vars: { [key: string]: string }) => {
	for (const key in vars) {
		text = text.replaceAll(`$${key}`, vars[key])
	}
	return text
}
