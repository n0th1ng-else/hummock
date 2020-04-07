import * as express from 'express';
import * as historyApiMiddleware from 'express-history-api-fallback';
import * as expressStaticGzip from 'express-static-gzip';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpackHistoryApiFallback from 'express-history-api-fallback-middleware';
import { Logger, pGreen } from '../log';
import { getConfig, getDevServerConfig } from '../../config/webpack/webpack.config';
import { pickApiRoutes } from '../api';
import { HummockConfig } from '../../models/config';
import { runBuild } from '../../scripts/build';
import { AppPaths } from '../../config/paths';

const logger = new Logger('express');

function initServer(): express.Application {
	const app: express.Application = express();
	app.use(express.json());
	app.set('etag', false);
	app.use((req, res, next) => {
		res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
		next();
	});
	return app;
}

function pickGui(app: express.Application, isDevelopment: boolean): Promise<express.Application> {
	if (isDevelopment) {
		const compiler = webpack(getConfig(!isDevelopment));
		app.use(webpackHistoryApiFallback());
		app.use(webpackDevMiddleware(compiler, getDevServerConfig()));
		app.use(webpackHotMiddleware(compiler));
		return Promise.resolve(app);
	}

	const keepData = true;
	return runBuild(keepData, !isDevelopment).then(() => {
		const paths = new AppPaths();
		app.use('/', expressStaticGzip(paths.release, {}));
		app.use(historyApiMiddleware(paths.files.htmlResult, { root: paths.release }));
		return Promise.resolve(app);
	});
}

export async function startServer(
	config: HummockConfig,
	isDevelopment: boolean,
	port = 3000
): Promise<void> {
	const app = initServer();
	return pickApiRoutes(app, config)
		.then(() => (config.enableGui ? pickGui(app, isDevelopment) : app))
		.then(appServer => {
			return new Promise(resolve => {
				appServer.listen(port, () => {
					logger.info(`${pGreen('Server started.')} Go visit http://localhost:${port} 🚀`);
					resolve();
				});
			});
		});
}
