import * as webpack from 'webpack';
import { generate as generateDev } from './webpack.config.dev';
import { generate as generateProd } from './webpack.config.prod';
import { Dictionary } from '../../models/types';

export function getConfig(isProductionMode: boolean): webpack.Configuration {
	return isProductionMode ? generateProd() : generateDev();
}

export function getDevServerConfig(): { stats: Dictionary<boolean> } {
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
