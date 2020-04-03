import { getAbsolutePath } from '../server/files';

export class AppPaths {
	public readonly root: string;
	public readonly release: string;
	public readonly src: string;
	public readonly modules: AppPathsModules;
	public readonly assets: AppPathsAssets;
	public readonly files: AppPathsFiles;
	public readonly commands: string;
	public readonly cliBin: string;

	private readonly dir = __dirname;

	constructor() {
		this.root = getAbsolutePath(this.dir, '..', '..');
		this.release = getAbsolutePath(this.root, 'release');
		this.src = getAbsolutePath(this.root, 'src');
		this.commands = getAbsolutePath(this.src, 'scripts');
		this.cliBin = getAbsolutePath(this.root, 'index.js');

		const clientPath = getAbsolutePath(this.src, 'client');
		this.modules = new AppPathsModules(this.root);
		this.assets = new AppPathsAssets(clientPath);
		this.files = new AppPathsFiles(clientPath, this.release);
	}

	public getCommand(name: string): string {
		return getAbsolutePath(this.commands, name);
	}
}

class AppPathsModules {
	public readonly zone: string;
	public readonly reflectMetadata: string;
	public readonly hmr: string;

	constructor(root: string) {
		this.zone = getAbsolutePath(root, 'node_modules', 'zone.js', 'dist', 'zone');
		this.reflectMetadata = getAbsolutePath(root, 'node_modules', 'reflect-metadata');
		this.hmr = getAbsolutePath(root, 'node_modules', 'webpack-hot-middleware', 'client');
	}
}

class AppPathsAssets {
	public readonly images: string;
	public readonly icons: string;

	constructor(publicPath: string) {
		this.images = getAbsolutePath(publicPath, 'assets', 'images');
		this.icons = getAbsolutePath(publicPath, 'assets', 'icons');
	}

	public getIcon(name: string): string {
		return getAbsolutePath(this.icons, name);
	}
}

class AppPathsFiles {
	public readonly app: string;
	public readonly htmlTemplate: string;
	public readonly htmlResult: string;

	constructor(clientPath: string, releasePath: string) {
		this.app = getAbsolutePath(clientPath, 'appLoader.ts');
		this.htmlTemplate = getAbsolutePath(clientPath, 'index.html');
		this.htmlResult = getAbsolutePath(releasePath, 'index.html');
	}
}
