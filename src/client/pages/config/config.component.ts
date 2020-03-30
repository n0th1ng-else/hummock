import { Component, NgModule } from '@angular/core';

@Component({
	selector: 'h-config',
	template: require('./config.component.html'),
	styles: []
})
export class ConfigComponent {}

@NgModule({
	declarations: [ConfigComponent],
	exports: [ConfigComponent]
})
export class ConfigComponentModule {}
