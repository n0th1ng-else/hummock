import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MaterialModule } from '../../app/material.module';
import { TitleService } from '../../services/title.service';
import { CommandService } from '../../services/command.service';
import { NavigationService } from '../../services/navigation.service';
import styles from './home.component.less';

@Component({
	selector: 'h-home',
	template: require('./home.component.html'),
	styles: [styles]
})
export class HomeComponent {
	public readonly servers = this.api.getProxies();

	constructor(
		private readonly titleService: TitleService,
		private readonly api: CommandService,
		private readonly navigation: NavigationService
	) {
		this.titleService.setTitle('Home');
	}

	public showHostDetails(hostId: string) {
		this.navigation.toHostDetails(hostId);
	}
}

@NgModule({
	imports: [CommonModule, MaterialModule],
	declarations: [HomeComponent],
	exports: [HomeComponent]
})
export class HomeComponentModule {}
