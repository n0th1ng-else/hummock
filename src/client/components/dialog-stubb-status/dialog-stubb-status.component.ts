import { Component, ChangeDetectionStrategy, NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../app/material.module';
import { StubbDetailsDto } from '../../../models/types';
import { NotificationService } from '../../services/notification.service';

@Component({
	selector: 'h-dialog-stubb-status',
	template: require('./dialog-stubb-status.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogStubbStatusComponent {
	public text: string;

	constructor(
		public readonly dialogRef: MatDialogRef<DialogStubbStatusComponent>,
		@Inject(MAT_DIALOG_DATA) public readonly data: StubbDetailsDto,
		private readonly notification: NotificationService
	) {
		this.text = `${data.content.res.status}`;
	}

	public closeDialog(text?: string): void {
		if (!text) {
			this.dialogRef.close(text);
			return;
		}

		const status = Number(text);
		if (!status) {
			this.notification.showMessage('Provided value is invalid 🛑');
			return;
		}

		this.dialogRef.close(status);
	}
}

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule],
	declarations: [DialogStubbStatusComponent],
	exports: [DialogStubbStatusComponent],
	entryComponents: [DialogStubbStatusComponent]
})
export class DialogStubbStatusComponentModule {}
