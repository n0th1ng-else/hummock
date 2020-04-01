import { Component, ChangeDetectionStrategy, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../app/material.module';
import { StubbDetailsDto } from '../../../models/types';
import styles from './dialog-stubb-body.component.less';

@Component({
	selector: 'h-dialog-stubb-body',
	template: require('./dialog-stubb-body.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class DialogStubbBodyComponent {
	public text: string;

	constructor(
		public readonly dialogRef: MatDialogRef<DialogStubbBodyComponent>,
		@Inject(MAT_DIALOG_DATA) public readonly data: StubbDetailsDto
	) {
		this.text = data.content.res.body;
	}

	public closeDialog(text?: string): void {
		this.dialogRef.close(text);
	}
}

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule],
	declarations: [DialogStubbBodyComponent],
	exports: [DialogStubbBodyComponent],
	entryComponents: [DialogStubbBodyComponent]
})
export class DialogStubbBodyComponentModule {}
