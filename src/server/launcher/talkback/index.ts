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
import { Logger } from '../../log';

const logger = new Logger('tb');

function tapeNameGenerator(tapeNumber: number, tape: Tape): string {
	return `${tape.req.method}-${cleanupString(tape.req.url)}`;
}

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
			logger.info(`${this.server.id} started`);
			return Promise.resolve();
		}

		return new Promise(resolve => {
			this.instance.start(() => {
				this.stateParam = ServerForRecordState.RUN;
				logger.info(`${this.server.id} started`);
				resolve();
			});
		});
	}

	public stop(): Promise<void> {
		if (!this.isLaunched()) {
			logger.info(`${this.server.id} in the idle state`);
			return Promise.resolve();
		}

		return new Promise(resolve => {
			this.instance.close(() => {
				this.stateParam = ServerForRecordState.IDLE;
				resolve();
			});
		})
			.then(() => {
				this.setupMock();
				return this.server.updateStubbCount();
			})
			.then(() => {
				logger.info(`${this.server.id} in the idle state`);
			});
	}

	public getDto(): Promise<ServerDetailsDto> {
		return this.server
			.updateStubbCount()
			.then(() => this.server.getStubbData())
			.then(stubbs => {
				return {
					state: this.state,
					id: this.server.id,
					host: this.server.host,
					port: this.server.port,
					stubbs: {
						total: this.server.stubbs,
						items: stubbs
					}
				};
			});
	}

	public getListDto(): Promise<ServerListDetailsDto> {
		return this.server.updateStubbCount().then(() => {
			return {
				state: this.state,
				id: this.server.id,
				host: this.server.host,
				port: this.server.port,
				stubbs: {
					total: this.server.stubbs
				}
			};
		});
	}

	public updateStubb(stubb: StubbDetailsDto): Promise<void> {
		return this.server.updateStubb(stubb);
	}

	public deleteStubb(stubbId: string): Promise<void> {
		return this.server.deleteStubb(stubbId);
	}

	public isLaunched(): boolean {
		return this.state === ServerForRecordState.RUN;
	}

	private setupMock(): void {
		this.instance = talkback({
			host: this.server.host,
			record: talkback.Options.RecordMode.NEW,
			port: this.server.port,
			path: this.server.workDir,
			tapeNameGenerator
		});
	}
}
