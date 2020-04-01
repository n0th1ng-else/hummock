import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../services/title.service';
import { MaterialModule } from '../../app/material.module';
import { ServerModel } from '../../models/server';
import { copyToClipboard } from '../../tools/clipboard';
import { NotificationService } from '../../services/notification.service';
import { HostStatusComponentModule } from '../../components/host-status/host-status.component';
import { StubbDetailsDto } from '../../../models/types';
import styles from './host.component.less';

@Component({
	selector: 'h-host',
	template: require('./host.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class HostComponent {
	public readonly server: ServerModel;
	public selectedStubb?: StubbDetailsDto;

	constructor(
		route: ActivatedRoute,
		private readonly titleService: TitleService,
		private readonly notification: NotificationService
	) {
		this.titleService.setTitle('Host');
		this.server = route.snapshot.data.server;
		console.log(this.server);
	}

	public selectStubb(stubb: StubbDetailsDto) {
		this.selectedStubb = stubb;
	}

	public clearStubbSelection() {
		this.selectedStubb = undefined;
	}

	public showStubbResponseBody() {
		console.log(this.selectedStubb);
		if (!this.selectedStubb) {
			return;
		}
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
	declarations: [HostComponent],
	imports: [CommonModule, MaterialModule, HostStatusComponentModule],
	exports: [HostComponent]
})
export class HostComponentModule {}
