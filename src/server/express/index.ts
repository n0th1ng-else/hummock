import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpackHistoryApiFallback from 'express-history-api-fallback-middleware';
import { Logger, pGreen } from '../log';
import { getConfig, getDevServerConfig } from '../../config/webpack/webpack.config';
import { pickApiRoutes } from '../api';
import { HummockConfig } from '../../models/config';

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

function pickGui(app: express.Application): express.Application {
	// TODO implement production mode
	const isProductionMode = false;
	const compiler = webpack(getConfig(isProductionMode));
	app.use(webpackHistoryApiFallback());
	app.use(webpackDevMiddleware(compiler, getDevServerConfig()));
	app.use(webpackHotMiddleware(compiler));
	return app;
}

export async function startServer(config: HummockConfig, port = 3000): Promise<void> {
	const app = initServer();
	return pickApiRoutes(app, config).then(() => {
		if (config.enableGui) {
			pickGui(app);
		}

		return new Promise(resolve => {
			app.listen(port, () => {
				logger.info(`${pGreen('Server started.')} Go visit http://localhost:${port} 🚀`);
				resolve();
			});
		});
	});
}
