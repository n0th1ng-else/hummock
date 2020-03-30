import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandService } from '../../services/command.service';
import { TitleService } from '../../services/title.service';

@Component({
	selector: 'h-config',
	template: require('./config.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: []
})
export class ConfigComponent {
	public readonly config = this.api.getConfig();

	constructor(private readonly titleService: TitleService, private readonly api: CommandService) {
		this.titleService.setTitle('Config');
	}
}

@NgModule({
	declarations: [ConfigComponent],
	imports: [CommonModule],
	exports: [ConfigComponent]
})
export class ConfigComponentModule {}
