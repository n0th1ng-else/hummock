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
import { map, switchMap, tap } from 'rxjs/operators';
import { MaterialModule } from '../../app/material.module';
import { TitleService } from '../../services/title.service';
import { CommandService } from '../../services/command.service';
import styles from './home.component.less';
import { Dictionary } from '../../models/types';
import { ServerCardComponentModule } from '../../components/server-card/server-card.component';
import { ServersMeta } from '../../models/server';

@Component({
	selector: 'h-home',
	template: require('./home.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class HomeComponent implements OnDestroy {
	public servers?: ServersMeta;
	public serversForm?: FormGroup;
	public selectedHosts = 0;
	public selectedAll = true;
	public allLaunched = 'start';

	private subscription?: Subscription;

	constructor(
		private readonly titleService: TitleService,
		private readonly fb: FormBuilder,
		private readonly api: CommandService,
		private readonly cdr: ChangeDetectorRef
	) {
		this.titleService.setTitle('Home');
		this.getData((servers) => this.createForm(servers));
	}

	public ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = undefined;
		}
	}

	public toggleRun(): void {
		const selectionState: Dictionary<boolean> = this.serversForm.value;
		this.api.toggleService(selectionState).subscribe(() => {
			this.getData();

			if (!this.serversForm) {
				return;
			}

			const formValues: Dictionary<boolean> = this.serversForm.value;
			Object.keys(formValues).forEach((key) => (formValues[key] = false));
			this.serversForm.patchValue(formValues);
		});
	}

	private createForm(servers: ServersMeta): void {
		const group = servers.items.reduce<Dictionary<false>>((res, item) => {
			res[item.id] = false;
			return res;
		}, {});
		this.serversForm = this.fb.group(group);
		this.serversForm.valueChanges.subscribe((form: Dictionary<boolean>) => {
			const selectedCount = Object.keys(form).reduce((res, key) => {
				res = form[key] ? res + 1 : res;
				return res;
			}, 0);
			const allCount = Object.keys(form).length;

			this.selectedAll = allCount === selectedCount || !selectedCount;
			this.selectedHosts = selectedCount;
			this.allLaunched = this.detectIfAllSelectedServicesLaunched(form, servers);
			this.cdr.markForCheck();
		});
	}

	private getData(onData?: (servers: ServersMeta) => void): void {
		this.api.getProxies().subscribe((servers) => {
			this.servers = servers;
			if (onData) {
				onData(servers);
			}
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
		const ids = allSelected ? Object.keys(form) : Object.keys(form).filter((id) => form[id]);
		const allStopped = ids.find((id) => {
			const server = servers.items.find((item) => item.id === id);
			return server && !server.isLaunched();
		});
		return allStopped ? 'start' : 'stop';
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
