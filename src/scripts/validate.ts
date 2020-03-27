import { existsSync, readFileSync } from 'fs';
import { defaultConfigPath } from '../config/index';
import { Logger, pRed, pYellow } from '../server/log';
import { HummockConfig, HummockConfigDto } from '../models/config';

const logger = new Logger('config');

export function validate(configPath = defaultConfigPath): HummockConfig {
	if (!existsSync(configPath)) {
		logger.error(
			pRed(
				`Unable to find config file. Tried ${pYellow(
					configPath
				)}, but have no luck. Does the file exists? 🤔`
			)
		);
		return getConfig();
	}

	const fileContent = readFileSync(configPath, { encoding: 'UTF8' });

	try {
		const content = JSON.parse(fileContent);
		return getConfig(content);
	} catch (err) {
		logger.error(pRed('Unable to read config file.🙁'), err);
		return getConfig();
	}
}

function getConfig(dto?: HummockConfigDto): HummockConfig {
	const config = new HummockConfig();

	if (dto) {
		config.setServers(dto.recordFrom);
		config.setWiremockConfig(dto.wiremock);
	}

	return config;
}
