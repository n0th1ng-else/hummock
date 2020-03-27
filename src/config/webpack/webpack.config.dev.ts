import * as webpack from 'webpack';
import { AppPaths } from '../paths';
import { ApplicationMode } from './types';
import { generate as generateCommon } from './webpack.config.common';

export function generate(): webpack.Configuration {
	const paths = new AppPaths();
	const config = generateCommon(false);
	const plugins = config.plugins || [];
	config.mode = ApplicationMode.DEVELOPMENT;
	config.devtool = 'cheap-module-eval-source-map';
	(config.entry as any).hmr = paths.modules.hmr;

	config.plugins = [
		...plugins,
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	];
	return config;
}
