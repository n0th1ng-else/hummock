import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MaterialModule } from '../../app/material.module';
import { TitleService } from '../../services/title.service';
import { CommandService } from '../../services/command.service';

@Component({
	selector: 'h-home',
	template: require('./home.component.html'),
	styles: []
})
export class HomeComponent {
	public readonly servers = this.api.getProxies();

	constructor(private readonly titleService: TitleService, private readonly api: CommandService) {
		this.titleService.setTitle('Home');
	}
}

@NgModule({
	imports: [CommonModule, MaterialModule],
	declarations: [HomeComponent],
	exports: [HomeComponent]
})
export class HomeComponentModule {}
