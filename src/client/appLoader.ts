import 'zone.js';
import 'reflect-metadata';
import { NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

class AppLoader {
	public launch(): void {
		this.bootstrap();
	}

	private bootstrap(): Promise<NgModuleRef<AppModule>> {
		return platformBrowserDynamic().bootstrapModule(AppModule);
	}
}

const application = new AppLoader();
application.launch();
