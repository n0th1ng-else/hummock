import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpackHistoryApiFallback from 'express-history-api-fallback-middleware';

import { Logger, pGreen } from '../log';
import { getConfig } from '../../config/webpack/webpack.config';

const logger = new Logger('express');

export async function startServer(port = 3000): Promise<void> {
	return new Promise((resolve, reject) => {
		const app: express.Application = express();

		// TODO implement production mode
		const compiler = webpack(getConfig(false));

		app.use(webpackHistoryApiFallback());
		app.use(webpackDevMiddleware(compiler));
		app.use(webpackHotMiddleware(compiler));

		app.listen(port, () => {
			logger.info(`${pGreen('Server started.')} Go visit http://localhost:${port} 🚀`);
			resolve();
		});
	});
}
