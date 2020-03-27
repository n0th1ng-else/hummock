import * as chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { defaultConfigPath } from "../config/index";
import { Logger } from '../server/log';
import { HummockConfig, HummockConfigDto } from '../models/config';

const logger = new Logger();

export function validate(configPath = defaultConfigPath): HummockConfig {
    if (!existsSync(configPath)) {
        logger.error(chalk.red(`Unable to find config file. Tried ${chalk.yellow(configPath)}, but have no luck. Does the file exists? 🤔`));
        return getConfig();
    }

    const fileContent = readFileSync(configPath, {encoding: 'UTF8'});
    
    try {
        const content = JSON.parse(fileContent);
        return getConfig(content);
    } catch (err) {
        logger.error(chalk.red('Unable to read config file.🙁'), err);
        return getConfig();
    }
}

function getConfig(dto?: HummockConfigDto): HummockConfig {
    const config = new HummockConfig();

    if (dto) {
        config.setServers(dto.recordFrom);
        config.setWiremockConfig(dto.wiremock)
    }
    
    return config;
}

