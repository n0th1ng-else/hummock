import { Logger } from '../server/log';
import { validate } from './validate';
import { downloadWiremock } from '../server/wiremock/index';
import { startServer } from '../server/express';
import { workDir, defaultConfigPath } from '../config';

const logger = new Logger('launcher');

export async function run() {
	const config = validate(defaultConfigPath, workDir);
	await downloadWiremock(config.wiremock, workDir);
	await startServer(config);
}
