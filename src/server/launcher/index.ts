import { HummockConfig, ServerForRecord } from '../../models/config';
import { ProxyProvider } from '../../config';
import { TalkbackServer } from './talkback';
import { WiremockServer } from './wiremock';
import {
	ServerForRecordState,
	ServerListDetailsDto,
	ServerDetailsDto,
	StubbDetailsDto
} from '../../models/types';

export function getLaunchers(config: HummockConfig): LauncherService[] {
	switch (config.provider) {
		case ProxyProvider.TALKBACK:
			return config.servers.map(server => new TalkbackServer(server));
		case ProxyProvider.WIREMOCK:
			return config.servers.map(server => new WiremockServer(server));
		default:
			return [];
	}
}

export interface LauncherService {
	readonly server: ServerForRecord;
	readonly state: ServerForRecordState;
	start(): Promise<void>;
	stop(): Promise<void>;
	isLaunched(): boolean;
	getListDto(): Promise<ServerListDetailsDto>;
	getDto(): Promise<ServerDetailsDto>;
	updateStubb(stubb: StubbDetailsDto): Promise<void>;
	deleteStubb(stubbId: string): Promise<void>;
}
