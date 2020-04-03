import { nanoid } from 'nanoid';
import { defaultWiremockVersion, ProxyProvider, firstServerPort } from '../config';
import {
	getFilesNumberInDir,
	getFilesInDir,
	writeFileOnDisk,
	deleteFile,
	getAbsolutePath
} from '../server/files';
import { StubbDetailsDto } from './types';
import { cleanupString } from './common';

export interface HummockConfigDto {
	provider?: ProxyProvider;
	recordFrom?: ServerForRecordDto[];
	wiremock?: WiremockConfigDto;
}

export class HummockConfig {
	public provider = ProxyProvider.TALKBACK;

	private config = new WiremockConfig(defaultWiremockVersion);
	private serversForRecord: ServerForRecord[] = [];

	constructor(public readonly workingDirRoot: string) {}

	public get wiremock(): WiremockConfig {
		return this.config;
	}

	public get servers(): ServerForRecord[] {
		return this.serversForRecord;
	}

	public setServers(servers?: ServerForRecordDto[]): void {
		if (!servers || !servers.length) {
			this.serversForRecord = [];
			return;
		}

		this.serversForRecord = servers.map(
			(server, portOffset) =>
				new ServerForRecord(server.host, firstServerPort + portOffset, this.workingDirRoot)
		);
	}

	public setWiremockConfig(wiremock?: WiremockConfigDto): void {
		if (!wiremock) {
			return;
		}
		this.config = new WiremockConfig(wiremock.version || defaultWiremockVersion);
	}

	public setProvider(provider?: ProxyProvider): void {
		this.provider =
			provider && provider === ProxyProvider.WIREMOCK
				? ProxyProvider.WIREMOCK
				: ProxyProvider.TALKBACK;
	}
}

interface ServerForRecordDto {
	host: string;
}

interface WiremockConfigDto {
	version?: string;
}

export class ServerForRecord {
	public readonly id = nanoid(5);
	public readonly workDir: string;
	public stubbs = 0;

	constructor(public readonly host: string, public readonly port: number, workingDirRoot: string) {
		const hostEscaped = cleanupString(host);
		this.workDir = getAbsolutePath(workingDirRoot, hostEscaped);
		this.updateStubbCount();
	}

	public updateStubbCount(): Promise<void> {
		return getFilesNumberInDir(this.workDir).then(stubbs => {
			this.stubbs = stubbs;
		});
	}

	public getStubbData(): Promise<StubbDetailsDto[]> {
		return getFilesInDir(this.workDir);
	}

	public updateStubb(stubb: StubbDetailsDto): Promise<void> {
		return writeFileOnDisk(this.workDir, stubb.name, stubb.content);
	}

	public deleteStubb(stubbId: string): Promise<void> {
		return deleteFile(this.workDir, stubbId);
	}
}

export class WiremockConfig {
	constructor(public readonly version: string) {}
}
