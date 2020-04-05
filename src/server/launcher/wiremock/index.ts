import { Logger, pGreen, pRed } from '../../log';
import { WiremockConfig, ServerForRecord } from '../../../models/config';
import { wiremockDownloadUrl, wiremockJarName } from '../../../config';
import { downloadFile } from '../../downloader';
import { LauncherService } from '..';
import {
	ServerForRecordState,
	ServerListDetailsDto,
	ServerDetailsDto,
	StubbDetailsDto
} from '../../../models/types';
import { isExistsByPath, makeDirByPath } from '../../files';

const logger = new Logger('wiremock');

export async function downloadWiremock(config: WiremockConfig, workDir: string): Promise<void> {
	return isExistsByPath(workDir)
		.then(isExists => {
			if (!isExists) {
				logger.info(pGreen('Working dir does not exists. Creating it ✨'));
				return makeDirByPath(workDir);
			}
		})
		.then(() => {
			const wiremockUrl = `${wiremockDownloadUrl}/${config.version}/${wiremockJarName(
				config.version
			)}`;
			logger.info(pGreen('Downloading Wiremock standalone ⌚️'));
			return downloadFile(wiremockUrl, workDir, wiremockJarName(config.version));
		})
		.catch(err => {
			logger.error(pRed('Unable to download Wiremock 👎'));
			throw err;
		});
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

	public getDto(): Promise<ServerDetailsDto> {
		throw new Error('Method not implemented.');
	}

	public getListDto(): Promise<ServerListDetailsDto> {
		throw new Error('Method not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public updateStubb(stubb: StubbDetailsDto): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public isLaunched(): boolean {
		throw new Error('Method not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public deleteStubb(stubbId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
