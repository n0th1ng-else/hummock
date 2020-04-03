import { getAbsolutePath } from '../server/files';

export const defaultConfigPath = getAbsolutePath(__dirname, '..', '..');

export const configName = 'hummock.json';

export const defaultWiremockVersion = '2.26.3';

export const wiremockDownloadUrl =
	'https://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone';

export const wiremockJarName = (version: string) => `wiremock-standalone-${version}.jar`;

export const workDir = getAbsolutePath(__dirname, '..', '..', 'workdir');

export enum ProxyProvider {
	TALKBACK = 'talkback',
	WIREMOCK = 'wiremock'
}

export const firstServerPort = 6000;
