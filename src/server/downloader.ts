import * as ProgressBar from 'progress';
import Axios from 'axios';
import { Logger, pGreen, pRed } from './log';
import { isExistsByPath, writeFileByPath, createFileStreamByPath } from './files';

const logger = new Logger('file-download');

export async function downloadFile(
	url: string,
	localFilePath: string,
	localFileName: string
): Promise<void> {
	return isExistsByPath(localFilePath, localFileName).then(isExists => {
		if (isExists) {
			logger.info(pGreen('File exists, skipping download ✨'));
			return;
		}

		logger.info(pGreen('Starting file download ⏱ '), url);
		return createFileAndDownload(url, localFilePath, localFileName);
	});
}

async function createFileAndDownload(
	url: string,
	localFilePath: string,
	localFileName: string
): Promise<void> {
	return writeFileByPath(localFilePath, localFileName, '').then(() =>
		downloadFileWithProgress(url, localFilePath, localFileName)
	);
}

async function downloadFileWithProgress(
	url: string,
	localFilePath: string,
	localFileName: string
): Promise<void> {
	const { data, headers } = await Axios({
		url,
		method: 'GET',
		responseType: 'stream'
	});

	return new Promise((resolve, reject) => {
		const totalLength = headers['content-length'];

		const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
			width: 40,
			complete: '=',
			incomplete: ' ',
			renderThrottle: 1,
			total: parseInt(totalLength)
		});

		data.on('data', (chunk: string) => progressBar.tick(chunk.length));
		data.on('end', () => {
			logger.info(pGreen('File successfully downloaded 🚀'));
			logger.info(pGreen('File stored as'), localFileName);
			resolve();
		});
		data.on('error', (err: Error) => {
			logger.error(pRed('Unable to download the file 👎'), err);
			reject(err);
		});
		data.pipe(createFileStreamByPath(localFilePath, localFileName));
	});
}
