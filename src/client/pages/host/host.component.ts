import {
	Component,
	NgModule,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	OnDestroy
} from '@angular/core';
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
import { CommandService } from '../../services/command.service';
import { switchMap, tap, catchError } from 'rxjs/operators';

@Component({
	selector: 'h-host',
	template: require('./host.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class HostComponent implements OnDestroy {
	public server: ServerModel;
	public selectedStubb?: StubbDetailsDto;
	public updater: number;

	private readonly id: string;

	constructor(
		route: ActivatedRoute,
		private readonly dialog: MatDialog,
		private readonly cdr: ChangeDetectorRef,
		private readonly titleService: TitleService,
		private readonly notification: NotificationService,
		private readonly api: CommandService
	) {
		this.titleService.setTitle('Host');
		this.server = route.snapshot.data.server;
		this.id = this.server.id;
		this.updater = window.setInterval(() => this.updateData(), 1000);
	}

	public ngOnDestroy() {
		if (this.updater) {
			window.clearInterval(this.updater);
			this.updater = 0;
		}
	}

	public selectStubb(stubb: StubbDetailsDto) {
		this.selectedStubb = stubb;
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

	public toggleServer(): void {
		const id = this.server.id;
		const shouldStart = this.isLaunched() ? false : true;
		this.api
			.toggleService({ run: shouldStart, ids: [id] })
			.pipe(
				tap(() =>
					this.notification.showMessage(
						shouldStart ? 'Server is running 🚀' : 'Server was stopped 🛑'
					)
				),
				switchMap(() => this.api.getProxy(id))
			)
			.subscribe(server => {
				this.server = server;
				this.cdr.markForCheck();
			});
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

	private updateData() {
		this.api
			.getProxy(this.id)
			.pipe(
				catchError(err => {
					if (this.updater) {
						window.clearInterval(this.updater);
						this.updater = 0;
					}
					throw err;
				})
			)
			.subscribe(server => {
				this.server = server;
				this.cdr.markForCheck();
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
