import * as webpack from 'webpack';
import { generate as generateDev } from './webpack.config.dev';
import { generate as generateProd } from './webpack.config.prod';

export function getConfig(isProductionMode: boolean): webpack.Configuration {
	return isProductionMode ? generateProd() : generateDev();
}

export function getDevServerConfig() {
	return {
		stats: {
			colors: true,
			hash: false,
			version: false,
			timings: false,
			assets: false,
			chunks: false,
			modules: false,
			reasons: false,
			children: false,
			source: false,
			warnings: false,
			publicPath: false
		}
	};
}
