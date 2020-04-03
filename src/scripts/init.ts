import { getCustomConfigLocation } from '../models/common';
import { getAbsolutePath } from '../server/files';
import { defaultConfigPath, configName } from '../config';

export function run(options: string[]): Promise<void> {
	const configPath =
		getCustomConfigLocation(options) || getAbsolutePath(defaultConfigPath, configName);
	// TODO generate hummock.json
	return Promise.resolve();
}
