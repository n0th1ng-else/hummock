import {
	Component,
	NgModule,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
	DialogStubbDeleteComponent,
	DialogStubbDeleteComponentModule
} from '../../components/dialog-stubb-delete/dialog-stubb-delete.component';
import {
	DialogStubbHeadersComponent,
	DialogStubbHeadersComponentModule
} from '../../components/dialog-stubb-headers/dialog-stubb-headers.component';
import { TitleService } from '../../services/title.service';
import { MaterialModule } from '../../app/material.module';
import { ServerModel } from '../../models/server';
import { copyToClipboard } from '../../tools/clipboard';
import { NotificationService } from '../../services/notification.service';
import { HostStatusComponentModule } from '../../components/host-status/host-status.component';
import { Dictionary, StubbDetailsDto } from '../../../models/types';
import { MatDialog } from '@angular/material/dialog';
import {
	DialogStubbBodyComponentModule,
	DialogStubbBodyComponent
} from '../../components/dialog-stubb-body/dialog-stubb-body.component';
import styles from './host.component.less';
import { CommandService } from '../../services/command.service';
import { switchMap, tap, catchError, filter, flatMap } from 'rxjs/operators';
import {
	DialogStubbStatusComponent,
	DialogStubbStatusComponentModule
} from '../../components/dialog-stubb-status/dialog-stubb-status.component';

@Component({
	selector: 'h-host',
	template: require('./host.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class HostComponent implements OnDestroy {
	public server: ServerModel;
	public updater: number;
	public hasNewData = false;

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

	public ngOnDestroy(): void {
		this.stopAutoRefresh();
	}

	public copyListenerUrl(): void {
		copyToClipboard(this.server.mockUrl);
		this.notification.showMessage('Copied to clipboard 🍕');
	}

	public changeStubbStatus(stubb: StubbDetailsDto): void {
		this.openStatusDialog(stubb);
	}

	public showStubbResponseBody(stubb: StubbDetailsDto): void {
		this.openBodyEditor(stubb);
	}

	public showStubbResponseHeaders(stubb: StubbDetailsDto): void {
		this.openHeadersEditor(stubb);
	}

	public showStubbDelete(stubb: StubbDetailsDto): void {
		this.confirmDelete(stubb);
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

	private openBodyEditor(stubb: StubbDetailsDto): void {
		this.dialog
			.open(DialogStubbBodyComponent, {
				width: '50%',
				height: '80%',
				data: stubb
			})
			.afterClosed()
			.pipe(
				filter((body?: string) => body !== undefined),
				flatMap((body: string) => {
					stubb.content.res.body = body;
					return this.api.updateStubb(this.id, { name: stubb.name, content: stubb.content });
				})
			)
			.subscribe(() => {
				this.cdr.markForCheck();
				this.notification.showMessage('Stubb was updated');
			});
	}

	private openStatusDialog(stubb: StubbDetailsDto): void {
		this.dialog
			.open(DialogStubbStatusComponent, {
				data: stubb
			})
			.afterClosed()
			.pipe(
				filter((status?: number) => !!status),
				flatMap((status: number) => {
					stubb.content.res.status = status;
					return this.api.updateStubb(this.id, { name: stubb.name, content: stubb.content });
				})
			)
			.subscribe(() => {
				this.cdr.markForCheck();
				this.notification.showMessage('Stubb was updated');
			});
	}

	private confirmDelete(stubb: StubbDetailsDto): void {
		this.dialog
			.open(DialogStubbDeleteComponent)
			.afterClosed()
			.pipe(
				filter((result?: boolean) => result),
				flatMap(() => this.api.deleteStubb(this.id, stubb))
			)
			.subscribe(() => {
				this.updateData(true);
				this.notification.showMessage('Stubb was deleted');
			});
	}

	private openHeadersEditor(stubb: StubbDetailsDto): void {
		this.dialog
			.open(DialogStubbHeadersComponent, {
				data: stubb
			})
			.afterClosed()
			.pipe(
				filter((result?: Dictionary<string[]>) => !!result),
				flatMap((headers: Dictionary<string[]>) => {
					stubb.content.res.headers = headers;
					return this.api.updateStubb(this.id, { name: stubb.name, content: stubb.content });
				})
			)
			.subscribe(() => {
				this.cdr.markForCheck();
				this.notification.showMessage('Stubb was updated');
			});
	}

	public isOptionsRequest(stubb: StubbDetailsDto): boolean {
		return stubb.content.req.method === 'OPTIONS';
	}

	private updateData(shouldRefresh = false): void {
		this.api
			.getProxy(this.id)
			.pipe(
				catchError(err => {
					this.stopAutoRefresh();
					throw err;
				})
			)
			.subscribe(server => {
				if (shouldRefresh) {
					this.server = server;
				}

				this.hasNewData = this.server.stubbs !== server.stubbs;

				if (!this.updater) {
					this.updater = window.setInterval(() => this.updateData(), 1000);
				}

				if (this.hasNewData) {
					this.stopAutoRefresh();
				}

				this.cdr.markForCheck();
			});
	}

	private stopAutoRefresh(): void {
		if (this.updater) {
			window.clearInterval(this.updater);
			this.updater = 0;
		}
	}
}

@NgModule({
	declarations: [HostComponent],
	imports: [
		CommonModule,
		MaterialModule,
		HostStatusComponentModule,
		DialogStubbBodyComponentModule,
		DialogStubbStatusComponentModule,
		DialogStubbHeadersComponentModule,
		DialogStubbDeleteComponentModule
	],
	exports: [HostComponent]
})
export class HostComponentModule {}
