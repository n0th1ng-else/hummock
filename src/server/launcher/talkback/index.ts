import talkback from 'talkback/es6';
import { LauncherService } from '..';
import { ServerForRecord } from '../../../models/config';
import { ServerForRecordState } from '../../../config';

export class TalkbackServer implements LauncherService {
	private stateParam = ServerForRecordState.IDLE;
	private readonly instance;

	public get state(): ServerForRecordState {
		return this.stateParam;
	}

	constructor(public readonly server: ServerForRecord) {
		this.instance = talkback({
			host: server.host,
			record: talkback.Options.RecordMode.NEW,
			port: server.port,
			path: server.workDir
		});
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
			this.server.updateStubbCount();
		});
	}
}
