import { configName } from '../config';
import { Logger, pRed, pYellow } from '../server/log';
import { HummockConfig, HummockConfigDto } from '../models/config';
import { isExistsByPath, readFileByPath } from '../server/files';

const logger = new Logger('config');

export function validate(configPath: string, workingDir: string): Promise<HummockConfig> {
	return isExistsByPath(configPath, configName).then(isExists => {
		if (!isExists) {
			logger.error(
				pRed(
					`Unable to find config file. Tried to look ${pYellow(configName)} in ${pYellow(
						configPath
					)}, but have no luck. Does the file exists? 🤔`
				)
			);
			return getConfig(workingDir);
		}

		return getConfigWhenExists(configPath, workingDir);
	});
}

function getConfigWhenExists(configPath: string, workingDir: string): Promise<HummockConfig> {
	return readFileByPath(configPath, configName).then(file => {
		try {
			const content = JSON.parse(file.data);
			return getConfig(workingDir, content);
		} catch (err) {
			logger.error(pRed('Unable to read config file.🙁'), err);
			return getConfig(workingDir);
		}
	});
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
