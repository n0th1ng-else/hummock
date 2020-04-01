import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../app/material.module';
import styles from './host-status.component.less';

@Component({
	selector: 'h-host-status',
	template: require('./host-status.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class HostStatusComponent {
	@Input() public isLaunched: boolean;
}

@NgModule({
	imports: [CommonModule, MaterialModule],
	declarations: [HostStatusComponent],
	exports: [HostStatusComponent]
})
export class HostStatusComponentModule {}
