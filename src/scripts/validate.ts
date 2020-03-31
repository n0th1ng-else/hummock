import { existsSync, readFileSync } from 'fs';
import { defaultConfigPath, workDir } from '../config';
import { Logger, pRed, pYellow } from '../server/log';
import { HummockConfig, HummockConfigDto } from '../models/config';

const logger = new Logger('config');

export function validate(configPath = defaultConfigPath, workingDir = workDir): HummockConfig {
	if (!existsSync(configPath)) {
		logger.error(
			pRed(
				`Unable to find config file. Tried ${pYellow(
					configPath
				)}, but have no luck. Does the file exists? 🤔`
			)
		);
		return getConfig(workingDir);
	}

	const fileContent = readFileSync(configPath, { encoding: 'UTF8' });

	try {
		const content = JSON.parse(fileContent);
		return getConfig(workingDir, content);
	} catch (err) {
		logger.error(pRed('Unable to read config file.🙁'), err);
		return getConfig(workingDir);
	}
}

function getConfig(workingDir: string, dto?: HummockConfigDto): HummockConfig {
	const config = new HummockConfig(workingDir);

	if (dto) {
		config.setProvider(dto.provider);
		config.setServers(dto.recordFrom);
		config.setWiremockConfig(dto.wiremock);
	}

	return config;
}
