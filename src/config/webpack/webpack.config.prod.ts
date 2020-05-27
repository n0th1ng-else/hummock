import * as webpack from 'webpack';
import { generate as generateCommon } from './webpack.config.common';

export function generate(): webpack.Configuration {
	const config = generateCommon(true);
	config.devtool = 'source-map';
	return config;
}
