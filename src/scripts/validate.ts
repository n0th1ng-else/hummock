import * as Ajv from 'ajv';
import { configName, configSchemaName, defaultConfigPath, workDir } from '../config';
import { Logger, pRed, pYellow } from '../server/log';
import { HummockConfig, HummockConfigDto } from '../models/config';
import { isExistsByPath, readFileByPath } from '../server/files';

const logger = new Logger('config');

export function run(options: string[]): Promise<void> {
	const workingDir = workDir;
	const configPath = defaultConfigPath;
	return validate(configPath, workingDir)
		.then(() => {
			logger.info('Config schema looks good!');
		})
		.catch(err => {
			logger.error('Config does not fit its schema', err);
		});
}

export function validate(configPath: string, workingDir: string): Promise<HummockConfig> {
	logger.info('Validating config... 💥');

	return isExistsByPath(configPath, configName)
		.then(isExists => {
			if (!isExists) {
				logger.error(
					pRed(
						`Unable to find config file. Tried to look ${pYellow(configName)} in ${pYellow(
							configPath
						)}, but have no luck. Does the file exists? 🤔`
					)
				);
				return Promise.reject(new Error('File not found'));
			}

			return Promise.all([
				readFileByPath(configPath, configSchemaName),
				readFileByPath(configPath, configName)
			]);
		})
		.then(([schema, config]) => {
			const validator = new Ajv({ allErrors: true });
			try {
				const sch = JSON.parse(schema.data);
				const cfg = JSON.parse(config.data);

				const valid = validator.validate(sch, cfg);
				const errorText =
					validator.errorsText() && validator.errorsText().toLowerCase() !== 'no errors'
						? validator.errorsText()
						: '';

				if (!valid) {
					return Promise.reject(new Error(errorText));
				}

				return getConfig(workingDir, cfg);
			} catch (err) {
				return Promise.reject(err);
			}
		});
}

function getConfig(workingDir: string, dto?: HummockConfigDto): HummockConfig {
	const config = new HummockConfig(workingDir);

	if (dto) {
		config
			.setProvider(dto.provider)
			.setServers(dto.recordFrom)
			.setWiremockConfig(dto.wiremock)
			.toggleGui(dto.gui)
			.setAutostart(dto.autostart);
	}

	return config;
}
