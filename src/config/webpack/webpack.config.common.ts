import * as webpack from 'webpack';
import * as HtmlPlugin from 'html-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';
import { AppPaths } from '../paths';
import { ApplicationMode } from './types';

export function generate(isProductionMode: boolean): webpack.Configuration {
	const paths = new AppPaths();

	const publicPath = paths.src;

	const zoneJsPath = paths.modules.zone;
	const reflectMetadataJsPath = paths.modules.reflectMetadata;

	const applicationPath = paths.files.app;

	const assetsImagesPath = paths.assets.images;
	const assetsIconsPath = paths.assets.icons;

	const htmlPath = paths.files.htmlTemplate;
	const htmlOutput = paths.files.htmlResult;

	return {
		mode: isProductionMode ? ApplicationMode.PRODUCTION : ApplicationMode.DEVELOPMENT,
		context: paths.root,
		entry: {
			application: applicationPath
		},
		output: {
			path: paths.release,
			filename: 'assets/[name].bundle.[hash].js',
			publicPath: ''
		},
		resolve: {
			extensions: ['.js', '.json', '.ts', '.less', '.css'],
			modules: ['node_modules'],
			alias: {
				zone: zoneJsPath,
				'reflect-metadata': reflectMetadataJsPath,
				_images: assetsImagesPath,
				_icons: assetsIconsPath
			}
		},
		module: {
			rules: [
				{
					test: /\.html$/,
					use: [
						{
							loader: 'html-loader',
							options: {
								minimize: false
							}
						}
					]
				},
				{
					test: /\.less$/,
					use: [
						{
							loader: 'raw-loader'
						},
						{
							loader: 'less-loader',
							options: {
								strictMath: true
							}
						}
					]
				},
				{
					test: /\.css/,
					use: [
						{
							loader: 'style-loader'
						},
						{
							loader: 'css-loader'
						}
					]
				},
				{
					test: /\.(jpg|png|eot|ttf|woff|woff2)$/,
					loader: 'url-loader',
					options: {
						limit: 25000,
						fallback: 'file-loader'
					}
				},
				{
					test: /\.ts$/,
					use: [
						{
							loader: 'awesome-typescript-loader',
							options: {
								logInfoToStdOut: true,
								logLevel: 'info'
							}
						}
					]
				}
			]
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						chunks: 'initial',
						minChunks: 2
					},
					vendor: {
						test: /node_modules/,
						chunks: 'initial',
						name: 'vendor',
						priority: 10,
						enforce: true
					}
				}
			},
			noEmitOnErrors: true,
			minimize: isProductionMode,
			minimizer: [new TerserPlugin()]
		},
		plugins: [
			new webpack.ContextReplacementPlugin(/angular(\\|\/)core/, publicPath),
			new webpack.DefinePlugin({
				runtimeConfig: JSON.stringify({
					isProductionMode,
					hmr: !isProductionMode
				})
			}),
			new HtmlPlugin({
				filename: htmlOutput,
				template: htmlPath
			})
		]
	};
}
