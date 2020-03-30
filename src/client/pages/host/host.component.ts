import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../services/title.service';

@Component({
	selector: 'h-host',
	template: require('./host.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostComponent {
	constructor(private readonly titleService: TitleService) {
		this.titleService.setTitle('Host');
	}
}

@NgModule({
	declarations: [HostComponent],
	imports: [CommonModule],
	exports: [HostComponent]
})
export class HostComponentModule {}
