import 'zone.js';
import 'reflect-metadata';
import { NgModuleRef, ApplicationRef, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { createNewHosts } from '@angularclass/hmr';
import { AppModule } from './app/app.module';

const runtimeConfig = {
	isProductionMode: false,
	hmr: true
};

class AppLoader {
	constructor() {
		if (runtimeConfig.isProductionMode) {
			enableProdMode();
		}
	}

	public launch(): Promise<any> {
		if (runtimeConfig.hmr) {
			return this.hmrBootstrap(module, this.bootstrap);
		} else {
			return this.bootstrap();
		}
	}

	private bootstrap(): Promise<NgModuleRef<AppModule>> {
		return platformBrowserDynamic().bootstrapModule(AppModule);
	}

	private hmrBootstrap(
		module: NodeModule,
		bootstrapHandler: () => Promise<NgModuleRef<AppModule>>
	): Promise<NgModuleRef<AppModule>> {
		if (module.hot) {
			let ngModule: NgModuleRef<any>;
			module.hot.accept();

			module.hot.dispose(() => {
				const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
				const elements = appRef.components.map(c => c.location.nativeElement);
				const makeVisible = createNewHosts(elements);
				ngModule.destroy();
				makeVisible();
			});

			return bootstrapHandler()
				.then(appModule => (ngModule = appModule))
				.catch(error => {
					console.error('Something went wrong with Module Loader', error);
					throw error;
				});
		} else {
			console.error('[HMR] Something went wrong with Hot Module Replacement');
			throw new Error('[HMR] Something went wrong with Hot Module Replacement');
		}
	}
}

const application = new AppLoader();
application
	.launch()
	.catch(error => console.error('Something went wrong with Module Loader', error));
