import { Logger } from '../server/log';
import { validate } from './validate';
import { startServer } from '../server/express';
import { workDir, defaultConfigPath } from '../config';
import { downloadWiremock } from '../server/launcher/wiremock';

const logger = new Logger('launcher');

export async function run() {
	const config = validate(defaultConfigPath, workDir);
	await downloadWiremock(config.wiremock, workDir);
	await startServer(config);
}
