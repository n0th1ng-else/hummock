import talkback from 'talkback/es6';
import { nanoid } from 'nanoid';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import {
	defaultWiremockVersion,
	ProxyProvider,
	firstServerPort,
	ServerForRecordState
} from '../config';

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
				new ServerForRecord(
					server.host,
					firstServerPort + portOffset,
					this.workingDirRoot,
					this.provider
				)
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

class ServerForRecord {
	public readonly id = nanoid(5);
	public readonly workDir: string;
	public stubbs = 0;
	public state = ServerForRecordState.IDLE;
	public readonly server?;

	constructor(
		public readonly host: string,
		public readonly port: number,
		workingDirRoot: string,
		provider: ProxyProvider
	) {
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
		if (provider === ProxyProvider.TALKBACK) {
			this.server = talkback({
				host: this.host,
				record: talkback.Options.RecordMode.NEW,
				port: this.port,
				path: this.workDir
			});
		}
	}

	public updateStubbCount(): void {
		this.stubbs = getFilesNumberInDir(this.workDir);
	}

	public start(): Promise<void> {
		if (!this.server) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			this.server.start(() => {
				this.state = ServerForRecordState.RUN;
				resolve();
			});
		});
	}

	public stop(): Promise<void> {
		if (!this.server) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			this.server.close(() => {
				this.state = ServerForRecordState.IDLE;
				resolve();
			});
		}).then(() => this.updateStubbCount());
	}
}

export class WiremockConfig {
	constructor(public readonly version: string) {}
}

function getFilesNumberInDir(dir: string): number {
	const files = readdirSync(dir);
	return files.length;
}
