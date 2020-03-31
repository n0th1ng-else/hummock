import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../services/title.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'h-host',
	template: require('./host.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostComponent {
	public readonly server;

	constructor(route: ActivatedRoute, private readonly titleService: TitleService) {
		this.titleService.setTitle('Host');
		this.server = route.snapshot.data.server;
		console.log(this.server);
	}
}

@NgModule({
	declarations: [HostComponent],
	imports: [CommonModule],
	exports: [HostComponent]
})
export class HostComponentModule {}
