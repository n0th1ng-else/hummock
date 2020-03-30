import { Component, NgModule } from '@angular/core';

@Component({
	selector: 'h-home',
	template: require('./home.component.html'),
	styles: []
})
export class HomeComponent {}

@NgModule({
	declarations: [HomeComponent],
	exports: [HomeComponent]
})
export class HomeComponentModule {}
