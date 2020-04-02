import * as json5 from 'json5';
import { resolve } from 'path';
import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { StubbDetailsDto, StubbFileDto } from '../models/types';

export function getFilesNumberInDir(dir: string): number {
	if (!existsSync(dir)) {
		return 0;
	}

	const files = readdirSync(dir);
	return files.length;
}

export function getFilesInDir(dir: string): StubbDetailsDto[] {
	if (!existsSync(dir)) {
		return [];
	}

	const files = readdirSync(dir);
	const sorted = files.sort((a, b) => a.localeCompare(b));

	return sorted
		.filter(file => {
			try {
				readFileSync(resolve(dir, file), 'utf8');
				return true;
			} catch (err) {
				return false;
			}
		})
		.map(file => {
			const content = readFileSync(resolve(dir, file), 'utf8');
			return {
				name: file,
				content: json5.parse(content)
			};
		});
}

export function writeFileOnDisk(dir: string, fileName: string, data: StubbFileDto): void {
	if (!existsSync(dir)) {
		throw new Error(`Directory ${dir} does not exists`);
	}

	const filePath = resolve(dir, fileName);

	const contentString = json5.stringify(data, null, 4);

	writeFileSync(filePath, contentString);
}

export function deleteFile(dir: string, fileName: string): void {
	if (!existsSync(dir)) {
		return;
	}

	const filePath = resolve(dir, fileName);
	unlinkSync(filePath);
}
