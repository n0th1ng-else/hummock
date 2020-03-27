import * as ProgressBar from 'progress';
import Axios from 'axios';
import { existsSync, createWriteStream, writeFileSync } from 'fs';
import { Logger, pGreen, pRed } from './log';

const logger = new Logger('file-download');

export async function downloadFile(url: string, localFileName: string): Promise<void> {
	if (existsSync(localFileName)) {
		logger.info(pGreen('File exists, skipping download 👌'));
		return;
	}

	logger.info(pGreen('Starting file download...⏱ '), url);
	writeFileSync(localFileName, '');

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
			logger.info(pGreen('File stored in'), localFileName);
			resolve();
		});
		data.on('error', (err: Error) => {
			logger.error(pRed('Unable to download the file 👎'), err);
			reject(err);
		});
		data.pipe(createWriteStream(localFileName));
	});
}
