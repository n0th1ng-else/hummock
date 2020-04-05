import { getCustomConfigLocation } from '../models/common';
import { getAbsolutePath } from '../server/files';
import { defaultConfigPath, configName } from '../config';

export function run(options: string[]): Promise<void> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const configPath =
		getCustomConfigLocation(options) || getAbsolutePath(defaultConfigPath, configName);
	// TODO generate hummock.json
	return Promise.resolve();
}
