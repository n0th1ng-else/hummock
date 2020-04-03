export function cleanupString(str: string, replacer = '-'): string {
	return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, replacer);
}

export function getCustomConfigLocation(appArgs: string[]): string {
	const cfgIndex = appArgs.findIndex(option => option === '--config');
	if (cfgIndex < 0) {
		return '';
	}

	return appArgs[cfgIndex + 1] || '';
}
