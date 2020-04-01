import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../app/material.module';
import { ServerModel } from '../../models/server';
import { NavigationService } from '../../services/navigation.service';
import { NotificationService } from '../../services/notification.service';
import { copyToClipboard } from '../../tools/clipboard';
import { HostStatusComponentModule } from '../host-status/host-status.component';
import styles from './server-card.component.less';

@Component({
	selector: 'h-server-card',
	template: require('./server-card.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class ServerCardComponent {
	@Input() public server: ServerModel;
	@Input() public form: FormGroup;

	constructor(
		private readonly navigation: NavigationService,
		private readonly notification: NotificationService
	) {}

	public showHostDetails(hostId: string): void {
		this.navigation.toHostDetails(hostId);
	}

	public isLaunched(): boolean {
		return this.server.isLaunched;
	}

	public copyMockName(): void {
		copyToClipboard(this.getMockName());
		this.notification.showMessage('Copied to clipboard 🍕');
	}

	public getMockName(): string {
		return this.server.mockUrl;
	}
}

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		HostStatusComponentModule
	],
	declarations: [ServerCardComponent],
	exports: [ServerCardComponent]
})
export class ServerCardComponentModule {}
