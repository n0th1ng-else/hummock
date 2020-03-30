import { ServerForRecordState } from '../../models/config';

export interface ServersDto extends ListDto<ServerDto> {}

export interface ServerDto {
	id: string;
	host: string;
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
