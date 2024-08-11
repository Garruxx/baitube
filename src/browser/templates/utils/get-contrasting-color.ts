export const getContrastingColor = (
	[r, g, b]: number[],
	contrastRatio: number = 70
) => {
	const luminance =
		0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255)

	if (luminance > 0.5) {
		return [
			Math.max(0, Math.min(255, r - contrastRatio)),
			Math.max(0, Math.min(255, g - contrastRatio)),
			Math.max(0, Math.min(255, b - contrastRatio)),
		]
	}
	return [
		Math.min(255, r + contrastRatio),
		Math.min(255, g + contrastRatio),
		Math.min(255, b + contrastRatio),
	]
}
