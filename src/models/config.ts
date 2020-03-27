import { defaultWiremockVersion } from "../config/index";

export interface HummockConfigDto {
    recordFrom?: ServerForRecordDto[];
    wiremock?: WiremockConfigDto;
}

export class HummockConfig {
    private config = new WiremockConfig(defaultWiremockVersion);
    private serversForRecord: ServerForRecord[] = [];

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

        this.serversForRecord = servers.map(server => new ServerForRecord(server.host));
    }

    public setWiremockConfig(wiremock?: WiremockConfigDto): void {
        if (!wiremock) {
            return;
        }
        this.config = new WiremockConfig(wiremock.version || defaultWiremockVersion); 
    }
}

interface ServerForRecordDto {
    host: string;
}

interface WiremockConfigDto {
    version?: string;
}

class ServerForRecord {
    constructor(public readonly host: string) {}
}

class WiremockConfig {
    constructor(public readonly version: string) {}
}
