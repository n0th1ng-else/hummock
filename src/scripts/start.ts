import { Logger } from '../server/log';
import { validate } from './validate';
import { startServer } from '../server/express';
import { workDir, defaultConfigPath, ProxyProvider, configName } from '../config';
import { downloadWiremock } from '../server/launcher/wiremock';
import { HummockConfig } from '../models/config';
import { getAbsolutePath } from '../server/files';
import { getCustomConfigLocation } from '../models/common';

const logger = new Logger('launcher');

export async function run(options: string[]): Promise<void> {
	const configPath =
		getCustomConfigLocation(options) || getAbsolutePath(defaultConfigPath, configName);

	return validate(configPath, workDir)
		.then(config => checkWiremock(config))
		.then(config => {
			logger.info('Starting hummock... 🚀');
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
