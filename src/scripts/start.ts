import { Logger } from '../server/log';
import { validate } from './validate';
import { startServer } from '../server/express';
import { workDir, defaultConfigPath, ProxyProvider } from '../config';
import { downloadWiremock } from '../server/launcher/wiremock';

const logger = new Logger('launcher');

export async function run(): Promise<void> {
	logger.info('Validating config... 💥');
	const config = validate(defaultConfigPath, workDir);

	if (config.provider === ProxyProvider.WIREMOCK) {
		await downloadWiremock(config.wiremock, workDir);
	}

	logger.info('Starting hummock... 💥');
	await startServer(config);
}
