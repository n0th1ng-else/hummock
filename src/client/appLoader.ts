import 'zone.js';
import 'reflect-metadata';
import { NgModuleRef, ApplicationRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { createNewHosts } from '@angularclass/hmr';
import { AppModule } from './app/app.module';

class AppLoader {
	public launch(): void {
		this.hmrBootstrap(module, this.bootstrap);
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
				const elements = appRef.components.map((c) => c.location.nativeElement);
				const makeVisible = createNewHosts(elements);
				ngModule.destroy();
				makeVisible();
			});

			return bootstrapHandler()
				.then((appModule) => (ngModule = appModule))
				.catch((error) => {
					// Logger.error('Something went wrong with Module Loader', error);
					throw error;
				});
		} else {
			// Logger.error('[HMR] Something went wrong with Hot Module Replacement');
			throw new Error('[HMR] Something went wrong with Hot Module Replacement');
		}
	}
}

const application = new AppLoader();
application.launch();
