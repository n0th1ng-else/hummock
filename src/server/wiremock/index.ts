import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { wiremockDownloadUrl, wiremockJarName } from '../../config';
import { Logger, pGreen, pRed } from '../log';
import { WiremockConfig } from '../../models/config';
import { downloadFile } from '../downloader';

const logger = new Logger('wiremock');

export async function downloadWiremock(config: WiremockConfig, workDir: string): Promise<void> {
	if (!existsSync(workDir)) {
		logger.info(pGreen('Working dir does not exists. Creating it...'));
		mkdirSync(workDir);
	}

	const wiremockUrl = `${wiremockDownloadUrl}/${config.version}/${wiremockJarName(config.version)}`;
	const wiremockLocalFile = resolve(workDir, wiremockJarName(config.version));

	try {
		logger.info(pGreen('Downloading Wiremock standalone'));
		await downloadFile(wiremockUrl, wiremockLocalFile);
	} catch (err) {
		logger.error(pRed('Unable to download Wiremock 👎'));
		throw err;
	}
}
