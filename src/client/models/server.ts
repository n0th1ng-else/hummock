import { ServerForRecordState, defaultHost } from '../../config';

export class ServerModel {
	constructor(
		public readonly id: string,
		public readonly host: string,
		public readonly port: number,
		public readonly state: ServerForRecordState,
		public readonly stubbs: number
	) {}

	public isLaunched(): boolean {
		return this.state === ServerForRecordState.RUN;
	}

	public getMock(): string {
		return `${defaultHost}:${this.port}`;
	}
}

export class ServersMeta {
	constructor(public readonly total: number, public readonly items: ServerModel[]) {}
}
