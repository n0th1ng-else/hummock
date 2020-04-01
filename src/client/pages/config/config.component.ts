import { Component, NgModule, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../services/title.service';
import { NestedTreeControl, CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MaterialModule } from '../../app/material.module';
import { ActivatedRoute } from '@angular/router';
import styles from './config.component.less';

@Component({
	selector: 'h-config',
	template: require('./config.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class ConfigComponent {
	public config;
	public treeControl = new NestedTreeControl<ConfigNode>(node => node.children);
	public dataSource = new MatTreeNestedDataSource<ConfigNode>();
	public hideRaw = 'show';

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly titleService: TitleService,
		route: ActivatedRoute
	) {
		this.titleService.setTitle('Config');
		this.config = route.snapshot.data.config;
		this.dataSource.data = this.generateTree(this.config);
	}

	public hasChild(_: number, node: ConfigNode) {
		return !!node.children && node.children.length > 0;
	}

	public toggleRawView(): void {
		this.hideRaw = this.hideRaw === 'hide' ? 'show' : 'hide';
		this.cdr.markForCheck();
	}

	private generateTree(config: object): ConfigNode[] {
		return Object.keys(config).map(key => {
			const isLeaf =
				typeof config[key] === 'string' ||
				typeof config[key] === 'number' ||
				typeof config[key] === 'boolean';
			const isArray = Array.isArray(config[key]);
			const arrayData = !isArray
				? []
				: config[key].reduce((res, item) => {
						res[item.host] = item;
						return res;
				  }, {});
			return {
				name: key,
				value: isLeaf ? `${config[key]}` : '',
				children: isLeaf ? [] : this.generateTree(isArray ? arrayData : config[key])
			};
		});
	}
}

@NgModule({
	declarations: [ConfigComponent],
	imports: [CommonModule, CdkTreeModule, MaterialModule],
	exports: [ConfigComponent]
})
export class ConfigComponentModule {}

interface ConfigNode {
	name: string;
	value: string;
	children?: ConfigNode[];
}
