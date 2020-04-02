import talkback from 'talkback/es6';
import Tape from 'talkback/tape';
import { LauncherService } from '..';
import { ServerForRecord } from '../../../models/config';
import {
	ServerForRecordState,
	ServerListDetailsDto,
	ServerDetailsDto,
	StubbDetailsDto
} from '../../../models/types';
import { cleanupString } from '../../../models/common';

export class TalkbackServer implements LauncherService {
	private stateParam = ServerForRecordState.IDLE;
	private instance;

	public get state(): ServerForRecordState {
		return this.stateParam;
	}

	constructor(public readonly server: ServerForRecord) {
		this.setupMock();
	}

	public start(): Promise<void> {
		if (this.isLaunched()) {
			return Promise.resolve();
		}

		return new Promise(resolve => {
			this.instance.start(() => {
				this.stateParam = ServerForRecordState.RUN;
				resolve();
			});
		});
	}

	public stop(): Promise<void> {
		if (!this.isLaunched()) {
			return Promise.resolve();
		}

		return new Promise(resolve => {
			this.instance.close(() => {
				this.stateParam = ServerForRecordState.IDLE;
				resolve();
			});
		}).then(() => {
			this.setupMock();
			this.server.updateStubbCount();
		});
	}

	public getDto(): ServerDetailsDto {
		this.server.updateStubbCount();
		return {
			state: this.state,
			id: this.server.id,
			host: this.server.host,
			port: this.server.port,
			stubbs: {
				total: this.server.stubbs,
				items: this.server.getStubbData()
			}
		};
	}

	public getListDto(): ServerListDetailsDto {
		this.server.updateStubbCount();
		return {
			state: this.state,
			id: this.server.id,
			host: this.server.host,
			port: this.server.port,
			stubbs: {
				total: this.server.stubbs
			}
		};
	}

	public updateStubb(stubb: StubbDetailsDto) {
		this.server.updateStubb(stubb);
	}

	public isLaunched(): boolean {
		return this.state === ServerForRecordState.RUN;
	}

	private setupMock() {
		this.instance = talkback({
			host: this.server.host,
			record: talkback.Options.RecordMode.NEW,
			port: this.server.port,
			path: this.server.workDir,
			tapeNameGenerator
		});
	}
}

function tapeNameGenerator(tapeNumber: number, tape: Tape): string {
	return `${tape.req.method}-${cleanupString(tape.req.url)}`;
}
