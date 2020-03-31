try {
	require('ts-node').register();
} catch (err) {
	console.error(err);
	process.exit(1);
}

const { Logger } = require('./src/server/log.ts');
const log = new Logger('ts-node');
log.info('Typescript compiler is registered 🚀');

const { run } = require('./src/scripts/start.ts');
run();
