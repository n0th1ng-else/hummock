import talkback from 'talkback/es6';
import { LauncherService } from '..';
import { ServerForRecord } from '../../../models/config';
import { ServerForRecordState } from '../../../config';

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
		if (this.state !== ServerForRecordState.IDLE) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			this.instance.start(() => {
				this.stateParam = ServerForRecordState.RUN;
				resolve();
			});
		});
	}

	public stop(): Promise<void> {
		if (this.state !== ServerForRecordState.RUN) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			this.instance.close(() => {
				this.stateParam = ServerForRecordState.IDLE;
				resolve();
			});
		}).then(() => {
			this.setupMock();
			this.server.updateStubbCount();
		});
	}

	public getDto(): any {
		return {
			stubbsData: [],
			state: this.state,
			id: this.server.id,
			host: this.server.host,
			port: this.server.port,
			stubbs: this.server.stubbs
		};
	}

	public getListDto(): any {
		return {
			state: this.state,
			id: this.server.id,
			host: this.server.host,
			port: this.server.port,
			stubbs: this.server.stubbs
		};
	}

	private setupMock() {
		this.instance = talkback({
			host: this.server.host,
			record: talkback.Options.RecordMode.NEW,
			port: this.server.port,
			path: this.server.workDir
		});
	}
}
