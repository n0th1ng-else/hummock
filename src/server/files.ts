import * as json5 from 'json5';
import { resolve } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';

export function getFilesNumberInDir(dir: string): number {
	if (!existsSync(dir)) {
		return 0;
	}

	const files = readdirSync(dir);
	return files.length;
}

export function getFilesInDir(dir: string) {
	if (!existsSync(dir)) {
		return [];
	}

	const files = readdirSync(dir);
	return files.map(file => {
		const content = readFileSync(resolve(dir, file), 'utf8');
		return {
			name: file,
			content: json5.parse(content)
		};
	});
}
