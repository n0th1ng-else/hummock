import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { MaterialModule } from '../../app/material.module';
import styles from './server-card.component.less';
import { ServerModel } from '../../models/server';
import { NavigationService } from '../../services/navigation.service';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'h-server-card',
	template: require('./server-card.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class ServerCardComponent {
	@Input() public server: ServerModel;
	@Input() public form: FormGroup;

	constructor(private readonly navigation: NavigationService) {}

	public showHostDetails(hostId: string): void {
		this.navigation.toHostDetails(hostId);
	}

	public isLaunched(): boolean {
		return this.server.isLaunched();
	}

	public copyMockName(): void {
		const mock = this.getMockName();
		console.log(mock);
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
