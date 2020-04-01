import { CommonModule } from '@angular/common';
import {
	Component,
	NgModule,
	ChangeDetectionStrategy,
	OnDestroy,
	ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../app/material.module';
import { TitleService } from '../../services/title.service';
import { CommandService } from '../../services/command.service';
import { ServerCardComponentModule } from '../../components/server-card/server-card.component';
import { ServersMeta } from '../../models/server';
import { NotificationService } from '../../services/notification.service';
import { startWith, flatMap, tap } from 'rxjs/operators';
import { Dictionary } from '../../../models/types';
import { ActivatedRoute } from '@angular/router';
import styles from './home.component.less';

@Component({
	selector: 'h-home',
	template: require('./home.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class HomeComponent implements OnDestroy {
	public servers: ServersMeta;
	public serversForm?: FormGroup;
	public selectedHosts = 0;
	public selectedAll = true;
	public allLaunched = 'start';

	private subscription?: Subscription;

	constructor(
		private readonly titleService: TitleService,
		private readonly fb: FormBuilder,
		private readonly cdr: ChangeDetectorRef,
		private readonly api: CommandService,
		private readonly notification: NotificationService,
		route: ActivatedRoute
	) {
		this.titleService.setTitle('Home');
		this.servers = route.snapshot.data.servers;
		this.createForm();
	}

	public ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = undefined;
		}
	}

	public toggleRun(): void {
		const selectionState: Dictionary<boolean> = this.serversForm.value;
		const allRows = this.selectedAllRows(selectionState);
		const filteredIds = allRows
			? Object.keys(selectionState)
			: Object.keys(selectionState).filter(key => selectionState[key]);
		const state = {
			run: !!this.servers.items
				.filter(server => filteredIds.includes(server.id))
				.find(server => !server.isLaunched),
			ids: filteredIds
		};

		this.api
			.toggleService(state)
			.pipe(
				tap(() => this.notification.showMessage(state.run ? 'Running 🚀' : 'Stopped 🛑')),
				flatMap(() => this.api.getProxies())
			)
			.subscribe(servers => {
				this.servers = servers;
				this.cdr.markForCheck();

				if (!this.serversForm) {
					return;
				}

				const formValues: Dictionary<boolean> = this.serversForm.value;
				Object.keys(formValues).forEach(key => (formValues[key] = false));
				this.allLaunched = this.detectIfAllSelectedServicesLaunched(formValues, this.servers);
				this.serversForm.patchValue(formValues);
			});
	}

	private createForm(): void {
		const group = this.servers.items.reduce<Dictionary<false>>((res, item) => {
			res[item.id] = false;
			return res;
		}, {});
		this.serversForm = this.fb.group(group);
		this.serversForm.valueChanges.pipe(startWith(group)).subscribe((form: Dictionary<boolean>) => {
			const selectedCount = Object.keys(form).reduce((res, key) => {
				res = form[key] ? res + 1 : res;
				return res;
			}, 0);
			const allCount = Object.keys(form).length;

			this.selectedAll = allCount === selectedCount || !selectedCount;
			this.selectedHosts = selectedCount;
			this.allLaunched = this.detectIfAllSelectedServicesLaunched(form, this.servers);
			this.cdr.markForCheck();
		});
	}

	private getData(): void {
		this.api.getProxies().subscribe(servers => {
			this.servers = servers;
			this.cdr.markForCheck();
		});
	}

	private detectIfAllSelectedServicesLaunched(
		form: Dictionary<boolean>,
		servers: ServersMeta
	): string {
		const hasSelected = Object.keys(form).reduce((res, key) => res || form[key], false);

		const allSelected =
			Object.keys(form).reduce((res, key) => res && form[key], true) || !hasSelected;
		const ids = allSelected ? Object.keys(form) : Object.keys(form).filter(id => form[id]);
		const allStopped = ids.find(id => {
			const server = servers.items.find(item => item.id === id);
			return server && !server.isLaunched;
		});

		return allStopped ? 'start' : 'stop';
	}

	private selectedAllRows(form: Dictionary<boolean>): boolean {
		const selected = Object.keys(form).filter(key => form[key]).length;
		const allRows = Object.keys(form).length;
		return !selected || selected === allRows;
	}
}

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		ServerCardComponentModule
	],
	declarations: [HomeComponent],
	exports: [HomeComponent]
})
export class HomeComponentModule {}
