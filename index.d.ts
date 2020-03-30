declare module '*.less';

declare module 'request-progress';

declare module 'compression-webpack-plugin';

declare module 'terser-webpack-plugin';

declare module 'webpack-dev-middleware';

declare module 'webpack-hot-middleware';

declare module 'express-history-api-fallback-middleware';

declare interface NodeModule {
	hot: {
		accept(path?: string, fn?: () => void, callback?: () => void): void;
		dispose(fn?: () => void): void;
	};
}
