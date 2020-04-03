import { sync } from 'cross-spawn';
import { AppPaths } from './src/config/paths';
import { Logger } from './src/server/log';
import { readDirByPath, isExistsByPath, getAbsolutePath } from './src/server/files';

const logger = new Logger('cli');

export function run(options: string[]): Promise<number> {
	// Get commands list
	const paths = new AppPaths();
	return readDirByPath(paths.commands).then(files => {
		const commands = files
			.filter(fn => fn.match(/\.[jt]s$/))
			.reduce((results, fn) => {
				const key = fn.replace(/\.[jt]s$/, '');
				results[key] = fn;
				return results;
			}, {});

		// Fetch command from the arguments
		const commandIndex = options.findIndex(arg => commands[arg]);
		const command = options[commandIndex] || options[0];
		const nodeArgs = options.slice(0, commandIndex);
		const commandArgs = options.slice(commandIndex + 1);

		if (!command) {
			logger.error('Hummock command is not provided. Please execute "hummock <command>"');
			logger.info(`Available commands are: \n  ${Object.keys(commands).join('\n  ')}`);
			return Promise.reject();
		}

		if (!commands[command]) {
			logger.error(`Unknown command "hummock ${command}".`);
			logger.info(`Available commands are: \n  ${Object.keys(commands).join('\n  ')}`);
			return Promise.reject();
		}

		// Spawn process
		logger.info(`Launching command "hummock ${command}"`);
		return runCommand(paths.commands, commands[command], nodeArgs, commandArgs);
	});
}

function runCommand(
	filePath: string,
	fileName: string,
	nodeArgs: string[],
	commandArgs: string[]
): Promise<number> {
	return isExistsByPath(filePath, fileName).then(isExists => {
		if (!isExists) {
			logger.error(`File ${fileName} does not exists. Terminating...`);
			return Promise.reject();
		}

		const paths = new AppPaths();
		const processArgs = nodeArgs.concat(
			paths.cliBin,
			'spawn',
			getAbsolutePath(paths.commands, fileName),
			commandArgs
		);

		logger.info('Spawning process');
		const result = sync('node', processArgs, { stdio: 'inherit' });

		if (result.signal) {
			if (result.signal === 'SIGKILL') {
				logger.error(
					'The build failed because the process exited too early. ' +
						'This probably means the system ran out of memory or someone called ' +
						'`kill -9` on the process.'
				);
			} else if (result.signal === 'SIGTERM') {
				logger.error(
					'The build failed because the process exited too early. ' +
						'Someone might have called `kill` or `killall`, or the system could ' +
						'be shutting down.'
				);
			} else {
				logger.error(`Process exited with signal ${result.signal}`);
			}
			return Promise.reject();
		}

		return result.status || 0;
	});
}
