import { Component, NgModule } from '@angular/core';
import { AppRoutingModule } from '../../app/app-routing.module';
import { HomeComponentModule } from '../../pages/home/home.component';
import { ConfigComponentModule } from '../../pages/config/config.component';
import { HostComponentModule } from '../../pages/host/host.component';

@Component({
	selector: 'hummock-app',
	template: require('./app.component.html'),
	styles: []
})
export class AppComponent {}

@NgModule({
	imports: [AppRoutingModule, HomeComponentModule, ConfigComponentModule, HostComponentModule],
	declarations: [AppComponent],
	exports: [AppComponent]
})
export class AppComponentModule {}
