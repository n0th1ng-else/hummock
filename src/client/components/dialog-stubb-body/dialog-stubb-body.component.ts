import * as json5 from 'json5';
import { Component, ChangeDetectionStrategy, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../app/material.module';
import { StubbDetailsDto } from '../../../models/types';
import styles from './dialog-stubb-body.component.less';
import e = require('express');
import { NotificationService } from '../../services/notification.service';

@Component({
	selector: 'h-dialog-stubb-body',
	template: require('./dialog-stubb-body.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class DialogStubbBodyComponent {
	public text: string;
	private readonly isJson: boolean;

	constructor(
		public readonly dialogRef: MatDialogRef<DialogStubbBodyComponent>,
		@Inject(MAT_DIALOG_DATA) public readonly data: StubbDetailsDto,
		private readonly notification: NotificationService
	) {
		this.isJson = typeof data.content.res.body === 'object';
		this.text = this.isJson ? json5.stringify(data.content.res.body) : data.content.res.body;
	}

	public closeDialog(text?: string): void {
		if (!text) {
			this.dialogRef.close(text);
			return;
		}

		if (!this.isJson) {
			this.dialogRef.close(text);
			return;
		}

		try {
			json5.parse(text);
			this.dialogRef.close(text);
		} catch (err) {
			this.notification.showMessage('Provided JSON is invalid 🛑');
			console.warn(err);
		}
	}
}

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule],
	declarations: [DialogStubbBodyComponent],
	exports: [DialogStubbBodyComponent],
	entryComponents: [DialogStubbBodyComponent]
})
export class DialogStubbBodyComponentModule {}
