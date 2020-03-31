import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../app/material.module';
import { ServerModel } from '../../models/server';
import { NavigationService } from '../../services/navigation.service';
import { NotificationService } from '../../services/notification.service';
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
		return this.server.isLaunched();
	}

	public copyMockName(): void {
		const hostName = this.getMockName();
		const clipboardElement = document.createElement('textarea');
		clipboardElement.value = hostName;
		clipboardElement.setAttribute('readonly', '');
		clipboardElement.style.position = 'absolute';
		clipboardElement.style.left = '-9999px';
		clipboardElement.style.display = 'none;';
		document.body.appendChild(clipboardElement);
		clipboardElement.select();
		document.execCommand('copy');
		document.body.removeChild(clipboardElement);
		this.notification.showMessage('Copied to clipboard 🍕');
	}

	public getMockName(): string {
		return this.server.getMock();
	}
}

@NgModule({
	imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
	declarations: [ServerCardComponent],
	exports: [ServerCardComponent]
})
export class ServerCardComponentModule {}
