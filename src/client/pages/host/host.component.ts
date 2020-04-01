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
import { MatDialog } from '@angular/material/dialog';
import {
	DialogStubbBodyComponentModule,
	DialogStubbBodyComponent
} from '../../components/dialog-stubb-body/dialog-stubb-body.component';
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
		private readonly dialog: MatDialog,
		private readonly titleService: TitleService,
		private readonly notification: NotificationService
	) {
		this.titleService.setTitle('Host');
		this.server = route.snapshot.data.server;
	}

	public selectStubb(stubb: StubbDetailsDto) {
		this.selectedStubb = stubb;
	}

	public clearStubbSelection() {
		this.selectedStubb = undefined;
	}

	public showStubbResponseBody() {
		if (!this.selectedStubb) {
			return;
		}

		this.openBodyEditor(this.selectedStubb);
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

	private openBodyEditor(stubb: StubbDetailsDto) {
		this.dialog
			.open(DialogStubbBodyComponent, {
				width: '50%',
				height: '80%',
				data: stubb
			})
			.afterClosed()
			.subscribe(result => {
				console.log('The dialog was closed', result);
			});
	}
}

@NgModule({
	declarations: [HostComponent],
	imports: [
		CommonModule,
		MaterialModule,
		HostStatusComponentModule,
		DialogStubbBodyComponentModule
	],
	exports: [HostComponent]
})
export class HostComponentModule {}
