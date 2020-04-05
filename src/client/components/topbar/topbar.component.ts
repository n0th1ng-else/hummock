import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../app/material.module';
import { NavigationService } from '../../services/navigation.service';
import styles from './topbar.component.less';

@Component({
	selector: 'h-topbar',
	template: require('./topbar.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class TopbarComponent {
	constructor(private readonly navigation: NavigationService) {}

	public openHome(): void {
		this.navigation.toHome();
	}

	public openConfig(): void {
		this.navigation.toConfig();
	}
}

@NgModule({
	imports: [MaterialModule, RouterModule],
	declarations: [TopbarComponent],
	exports: [TopbarComponent]
})
export class TopbarComponentModule {}
