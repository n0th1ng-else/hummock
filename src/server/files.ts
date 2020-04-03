import * as json5 from 'json5';
import { resolve } from 'path';
import {
	unlink,
	readdir,
	stat,
	writeFile,
	readFile,
	mkdir,
	createWriteStream,
	WriteStream
} from 'fs';
import { StubbDetailsDto, StubbFileDto } from '../models/types';

export function getAbsolutePath(...parts: string[]): string {
	return resolve(...parts.filter(part => !!part));
}

export function readDirByPath(dir: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) =>
		readdir(dir, (err, files) => (err ? reject(err) : resolve(files)))
	);
}

export function deleteFileByPath(dir: string, fileName: string): Promise<void> {
	const filePath = resolve(dir, fileName);
	return new Promise((resolve, reject) => {
		unlink(filePath, err => (err ? reject(err) : resolve()));
	});
}

export function createFileStreamByPath(dir: string, fileName: string): WriteStream {
	const filePath = resolve(dir, fileName);
	return createWriteStream(filePath);
}

export function writeFileByPath<Data>(dir: string, fileName: string, content: Data): Promise<void> {
	const filePath = resolve(dir, fileName);
	return new Promise((resolve, reject) => {
		writeFile(filePath, content, err => (err ? reject(err) : resolve()));
	});
}

export function makeDirByPath(dir: string): Promise<void> {
	return new Promise((resolve, reject) => {
		mkdir(dir, err => (err ? reject(err) : resolve()));
	});
}

export function readFileByPath(
	dir: string,
	fileName: string
): Promise<{ name: string; data: string }> {
	const filePath = resolve(dir, fileName);
	return new Promise((resolve, reject) => {
		readFile(filePath, 'utf8', (err, data) =>
			err ? reject(err) : resolve({ name: fileName, data })
		);
	});
}

export function isExistsByPath(dir: string, fileName?: string): Promise<boolean> {
	const path = fileName ? resolve(dir, fileName) : dir;
	return new Promise<boolean>((resolve, reject) => {
		stat(path, err => {
			if (err && err.code === 'ENOENT') {
				return resolve(false);
			}

			return err ? reject(err) : resolve(true);
		});
	});
}

export function getFilesNumberInDir(dir: string): Promise<number> {
	return isExistsByPath(dir)
		.then(dirExists => (dirExists ? readDirByPath(dir) : []))
		.then(files => files.length);
}

export function getFilesInDir(dir: string): Promise<StubbDetailsDto[]> {
	return isExistsByPath(dir)
		.then(dirExists => (dirExists ? readDirByPath(dir) : []))
		.then(files => {
			const sorted = files.sort((a, b) => a.localeCompare(b));
			return Promise.all(sorted.map(file => readFileByPath(dir, file)));
		})
		.then(files => {
			return files.map(file => {
				return {
					name: file.name,
					content: json5.parse(file.data)
				};
			});
		});
}

export function writeFileOnDisk(dir: string, fileName: string, data: StubbFileDto): Promise<void> {
	return isExistsByPath(dir).then(dirExists => {
		if (!dirExists) {
			return Promise.reject(new Error(`Directory ${dir} does not exists`));
		}

		const contentString = json5.stringify(data, null, 4);
		return writeFileByPath(dir, fileName, contentString);
	});
}

export async function deleteFile(dir: string, fileName: string): Promise<void> {
	return isExistsByPath(dir)
		.then(dirExists => {
			if (!dirExists) {
				return false;
			}

			return isExistsByPath(dir, fileName);
		})
		.then(fileExists => {
			if (!fileExists) {
				return;
			}

			return deleteFileByPath(dir, fileName);
		});
}
