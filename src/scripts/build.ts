import * as webpack from 'webpack';
import { Logger, pRed, pGreen } from '../server/log';
import { AppPaths } from '../config/paths';
import { getConfig } from '../config/webpack/webpack.config';
import { isExistsByPath, readDirByPath } from '../server/files';

const logger = new Logger('builder');

async function buildAssets(
	config: webpack.Configuration,
	releasePath: string,
	keepData = true
): Promise<void> {
	return isExistsByPath(releasePath).then(isExists => {
		if (isExists && keepData) {
			logger.warn('Release directory exists. Bypassing bundles compilation');
			return Promise.resolve();
		}

		const compiler = webpack(config);
		return new Promise((resolve, reject) => {
			const startDate = new Date().getTime();

			logger.info('Compiling bundles...');
			compiler.run(err => {
				if (err) {
					reject(err);
					return;
				}
				const stopDate = new Date().getTime();
				const timeSec = (stopDate - startDate) / 1000;
				logger.info(`Bundles built. ${pGreen(`Took ${timeSec} sec`)}`);
				resolve();
			});
		});
	});
}

async function checkIfReleaseBuilt(dir: string): Promise<string[]> {
	return isExistsByPath(dir).then(isExists => {
		if (!isExists) {
			const files: string[] = [];
			return files;
		}

		return readDirByPath(dir);
	});
}

export async function runBuild(keepData: boolean, isProduction: boolean): Promise<void> {
	const paths = new AppPaths();
	const config = getConfig(isProduction);

	logger.info('Building assets started');

	return buildAssets(config, paths.release, keepData)
		.then(() => checkIfReleaseBuilt(paths.release))
		.then(files => {
			if (!files.length) {
				return Promise.reject(new Error('Release folder is empty'));
			}

			logger.info('Building assets complete');
		})
		.catch(err => {
			logger.error(pRed('Error occurred while building assets'), err);
			throw err;
		});
}

export async function run(): Promise<void> {
	const keepData = false;
	const isProduction = true;
	return runBuild(keepData, isProduction)
		.then(() => {
			process.exit(0);
		})
		.catch(() => {
			process.exit(1);
		});
}
