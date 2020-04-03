#!/usr/bin/env node

try {
	require('ts-node').register();
} catch (err) {
	console.error(err);
	process.exit(1);
}

/* Skip first two arguments as
 * 1. NodeJS executable
 * 2. CLI executable
 */
const args = process.argv.slice(2);
const commandIndex = args.findIndex(arg => arg === 'spawn');
const withCommand = commandIndex !== -1;
const mdl = withCommand ? require(args[commandIndex + 1]) : require('./cliHandler');

mdl
	.run(args)
	.then(status => {
		if (withCommand) {
			return;
		}
		process.exit(status);
	})
	.catch(() => {
		process.exit(1);
	});
