import { nanoid } from 'nanoid';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';
import { defaultWiremockVersion, ProxyProvider, firstServerPort } from '../config';
import { getFilesNumberInDir, getFilesInDir, writeFileOnDisk } from '../server/files';
import { StubbDetailsDto } from './types';

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
		const hostEscaped = host
			.replace(/\./g, '')
			.replace(/\/\//g, '')
			.replace(/\:/g, '')
			.replace(/\:/g, '')
			.replace(/\#/g, '')
			.replace(/\?/g, '')
			.replace(/\//g, '');
		this.workDir = resolve(workingDirRoot, hostEscaped);
		this.updateStubbCount();
	}

	public updateStubbCount(): void {
		this.stubbs = getFilesNumberInDir(this.workDir);
	}

	public getStubbData(): StubbDetailsDto[] {
		return getFilesInDir(this.workDir);
	}

	public updateStubb(stubb: StubbDetailsDto): void {
		writeFileOnDisk(this.workDir, stubb.name, stubb.content);
	}
}

export class WiremockConfig {
	constructor(public readonly version: string) {}
}
