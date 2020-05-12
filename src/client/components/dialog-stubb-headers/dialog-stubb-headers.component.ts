import {
	Component,
	ChangeDetectionStrategy,
	NgModule,
	Inject,
	ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { MaterialModule } from '../../app/material.module';
import { Dictionary, StubbDetailsDto } from '../../../models/types';
import {
	DialogStubbHeaderComponent,
	DialogStubbHeaderComponentModule
} from '../dialog-stubb-header/dialog-stubb-header.component';

export class HeaderItem {
	constructor(public header: string, public value = '') {}
}

@Component({
	selector: 'h-dialog-stubb-headers',
	template: require('./dialog-stubb-headers.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogStubbHeadersComponent {
	public headers: HeaderItem[];

	constructor(
		public readonly dialogRef: MatDialogRef<DialogStubbHeadersComponent>,
		@Inject(MAT_DIALOG_DATA) public readonly data: StubbDetailsDto,
		private readonly dialog: MatDialog,
		private readonly cdr: ChangeDetectorRef
	) {
		const headers = data.content.res.headers;
		this.headers = Object.keys(headers).map(header => {
			const values = headers[header];
			const value = values && values.length ? values[0] : '';
			return new HeaderItem(header, value);
		});
	}

	public closeDialog(shouldSave: boolean): void {
		if (!shouldSave) {
			this.dialogRef.close();
			return;
		}

		const data = this.headers
			.filter(hd => hd.value)
			.reduce<Dictionary<string[]>>((res, header) => {
				res[header.header] = [header.value];
				return res;
			}, {});

		this.dialogRef.close(data);
	}

	public openHeaderDialog(): void {
		this.dialog
			.open(DialogStubbHeaderComponent, {
				width: '30%'
			})
			.afterClosed()
			.pipe(filter((result?: string) => !!result))
			.subscribe((title: string) => {
				const header = new HeaderItem(title);
				this.openHeaderValueDialog(header);
			});
	}

	public openHeaderValueDialog(header: HeaderItem): void {
		this.dialog
			.open(DialogStubbHeaderComponent, {
				data: header,
				width: '50%'
			})
			.afterClosed()
			.pipe(filter((result?: string) => typeof result === 'string'))
			.subscribe((value: string) => {
				const item = new HeaderItem(header.header, value);
				const exists = this.headers.some(hd => hd.header === item.header);
				if (exists) {
					this.headers = this.headers.map(hd => {
						return hd.header === item.header ? item : hd;
					});
				} else {
					this.headers = [...this.headers, item];
				}
				this.cdr.markForCheck();
			});
	}
}

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule, DialogStubbHeaderComponentModule],
	declarations: [DialogStubbHeadersComponent],
	exports: [DialogStubbHeadersComponent],
	entryComponents: [DialogStubbHeadersComponent]
})
export class DialogStubbHeadersComponentModule {}
