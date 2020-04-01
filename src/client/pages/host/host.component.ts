import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../services/title.service';
import { MaterialModule } from '../../app/material.module';
import { ServerModel } from '../../models/server';

@Component({
	selector: 'h-host',
	template: require('./host.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostComponent {
	public readonly server: ServerModel;

	constructor(route: ActivatedRoute, private readonly titleService: TitleService) {
		this.titleService.setTitle('Host');
		this.server = route.snapshot.data.server;
		console.log(this.server);
	}
}

@NgModule({
	declarations: [HostComponent],
	imports: [CommonModule, MaterialModule],
	exports: [HostComponent]
})
export class HostComponentModule {}
