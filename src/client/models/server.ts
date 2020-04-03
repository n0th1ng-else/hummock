import { defaultHost } from '../../config/both';
import { ServerForRecordState, StubbDetailsDto } from '../../models/types';

export class ServerModel {
	public get isLaunched(): boolean {
		return this.state === ServerForRecordState.RUN;
	}

	public get mockUrl(): string {
		return `${defaultHost}:${this.port}`;
	}

	constructor(
		public readonly id: string,
		public readonly host: string,
		public readonly port: number,
		public readonly state: ServerForRecordState,
		public stubbs: number,
		public readonly stubbData?: StubbDetailsDto[]
	) {}
}

export class ServersMeta {
	constructor(public readonly total: number, public readonly items: ServerModel[]) {}
}
