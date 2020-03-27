import * as webpack from 'webpack';
import * as CompressionPlugin from 'compression-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';
import { ApplicationMode } from './types';
import { generate as generateCommon } from './webpack.config.common';

export function generate(): webpack.Configuration {
	const config = generateCommon(true);
	const plugins = config.plugins || [];
	config.mode = ApplicationMode.PRODUCTION;
	config.devtool = 'source-map';
	config.optimization = {
		minimize: true,
		minimizer: [new TerserPlugin()]
	};
	config.plugins = [...plugins, new CompressionPlugin()];
	return config;
}
