export function cleanupString(str: string, replacer = '-'): string {
	return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, replacer);
}
