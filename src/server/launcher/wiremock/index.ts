import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { Logger, pGreen, pRed } from '../../log';
import { WiremockConfig, ServerForRecord } from '../../../models/config';
import { wiremockDownloadUrl, wiremockJarName, ServerForRecordState } from '../../../config';
import { downloadFile } from '../../downloader';
import { LauncherService } from '..';

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

export class WiremockServer implements LauncherService {
	private stateParam = ServerForRecordState.IDLE;

	public get state(): ServerForRecordState {
		return this.stateParam;
	}

	constructor(public readonly server: ServerForRecord) {}

	public start(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public stop(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
