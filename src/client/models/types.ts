import { ServerForRecordState } from '../../config';

export interface ServersDto extends ListDto<ServerDto> {}

export interface ServerDto {
	id: string;
	host: string;
	port: number;
	stubbs: number;
	state: ServerForRecordState;
}

export interface Dictionary<Data> {
	[key: string]: Data;
}

interface ListDto<Data> {
	total: number;
	items: Data[];
}
