import { resolve } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { Logger } from './log';

const logger = new Logger('files');

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
	logger.info(files); // TODO implement
	return [];
}
