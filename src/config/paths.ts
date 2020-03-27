import { resolve } from 'path';

export class AppPaths {
	public readonly root: string;
	public readonly release: string;
	public readonly src: string;
	public readonly modules: AppPathsModules;
	public readonly assets: AppPathsAssets;
	public readonly files: AppPathsFiles;
	public readonly commands: string;

	private readonly dir = __dirname;

	constructor() {
		this.root = resolve(this.dir, '../..');
		this.release = resolve(this.root, 'release');
		this.src = resolve(this.root, 'src');
		this.commands = resolve(this.src, 'scripts');

		const clientPath = resolve(this.src, 'client');
		this.modules = new AppPathsModules(this.root);
		this.assets = new AppPathsAssets(clientPath);
		this.files = new AppPathsFiles(clientPath, this.release);
	}

	public getCommand(name: string): string {
		return resolve(this.commands, name);
	}
}

class AppPathsModules {
	public readonly zone: string;
	public readonly reflectMetadata: string;
	public readonly hmr: string;

	constructor(root: string) {
		this.zone = resolve(root, 'node_modules', 'zone.js', 'dist', 'zone');
		this.reflectMetadata = resolve(root, 'node_modules', 'reflect-metadata');
		this.hmr = resolve(root, 'node_modules', 'webpack-hot-middleware', 'client');
	}
}

class AppPathsAssets {
	public readonly images: string;
	public readonly icons: string;

	constructor(publicPath: string) {
		this.images = resolve(publicPath, 'assets', 'images');
		this.icons = resolve(publicPath, 'assets', 'icons');
	}

	public getIcon(name: string): string {
		return resolve(this.icons, name);
	}
}

class AppPathsFiles {
	public readonly app: string;
	public readonly htmlTemplate: string;
	public readonly htmlResult: string;

	constructor(clientPath: string, releasePath: string) {
		this.app = resolve(clientPath, 'appLoader.ts');
		this.htmlTemplate = resolve(clientPath, 'index.html');
		this.htmlResult = resolve(releasePath, 'index.html');
	}
}
