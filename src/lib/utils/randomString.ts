
export function generateString(length: number): string {
	return (+new Date * Math.random()).toString(36).substring(0, length).toUpperCase();
}
