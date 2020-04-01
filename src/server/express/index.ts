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

export async function startServer(config: HummockConfig, port = 3000): Promise<void> {
	return new Promise(resolve => {
		const app: express.Application = express();
		app.use(express.json());
		app.set('etag', false);
		app.use((req, res, next) => {
			res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
			next();
		});

		// TODO implement production mode
		const compiler = webpack(getConfig(false));

		pickApiRoutes(app, config);
		app.use(webpackHistoryApiFallback());
		app.use(webpackDevMiddleware(compiler, getDevServerConfig()));
		app.use(webpackHotMiddleware(compiler));

		app.listen(port, () => {
			logger.info(`${pGreen('Server started.')} Go visit http://localhost:${port} 🚀`);
			resolve();
		});
	});
}
