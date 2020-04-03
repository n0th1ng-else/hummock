import { Logger } from '../server/log';
import { validate } from './validate';
import { startServer } from '../server/express';
import { workDir, defaultConfigPath, ProxyProvider } from '../config';
import { downloadWiremock } from '../server/launcher/wiremock';
import { HummockConfig } from '../models/config';

const logger = new Logger('launcher');

export async function run(options: string[]): Promise<void> {
	return validate(defaultConfigPath, workDir)
		.then(config => checkWiremock(config))
		.then(config => {
			logger.info('Starting hummock... 💥');
			return startServer(config);
		})
		.catch(err => {
			logger.error('Something went wrong', err);
		});
}

function checkWiremock(config: HummockConfig) {
	if (config.provider === ProxyProvider.WIREMOCK) {
		return downloadWiremock(config.wiremock, workDir).then(() => config);
	}

	return Promise.resolve(config);
}
