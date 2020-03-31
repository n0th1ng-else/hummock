import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { AppRoutingModule } from '../../app/app-routing.module';
import { HomeComponentModule } from '../../pages/home/home.component';
import { ConfigComponentModule } from '../../pages/config/config.component';
import { HostComponentModule } from '../../pages/host/host.component';
import { TopbarComponentModule } from '../topbar/topbar.component';
import styles from './app.component.less';

@Component({
	selector: 'hummock-app',
	template: require('./app.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class AppComponent {}

@NgModule({
	imports: [
		AppRoutingModule,
		HomeComponentModule,
		ConfigComponentModule,
		HostComponentModule,
		TopbarComponentModule
	],
	declarations: [AppComponent],
	exports: [AppComponent]
})
export class AppComponentModule {}
