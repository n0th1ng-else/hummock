import { resolve } from 'path'

export const defaultConfigPath = resolve(__dirname, '../../hummock.json');

export const defaultWiremockVersion = '2.26.3';

export const wiremockDownloadUrl = 'https://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone';

export const wiremockJarName = (version: string) => `wiremock-standalone-${version}.jar`;

export const workDir = resolve(__dirname, '../../workdir');