import * as webpack from 'webpack';
import { generate as generateDev } from './webpack.config.dev';
import { generate as generateProd } from './webpack.config.prod';

export function getConfigr(isProductionMode: boolean): webpack.Configuration {
	return isProductionMode ? generateProd() : generateDev();
}
