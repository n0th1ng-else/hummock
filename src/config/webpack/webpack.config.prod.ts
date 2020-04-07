import * as webpack from 'webpack';
import * as CompressionPlugin from 'compression-webpack-plugin';
import { generate as generateCommon } from './webpack.config.common';

export function generate(): webpack.Configuration {
	const config = generateCommon(true);
	const plugins = config.plugins || [];
	config.devtool = 'source-map';
	config.plugins = [...plugins, new CompressionPlugin()];
	return config;
}
