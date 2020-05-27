import * as express from 'express';
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

		app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
			const isJS = /.js$/.test(req.path);
			const isGet = req.method === 'GET';
			if (isGet && !isJS) {
				res.sendFile('index.html', { root: paths.release }, () => next());
				return;
			}

			if (isGet && isJS) {
				res.sendFile(req.path, { root: paths.release }, () => next());
				return;
			}
			next();
		});
		return Promise.resolve(app);
	});
}

export async function startServer(
	config: HummockConfig,
	isDevelopment: boolean,
	port
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
