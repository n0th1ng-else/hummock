import {
	Component,
	ChangeDetectionStrategy,
	NgModule,
	Inject,
	ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../app/material.module';
import { NotificationService } from '../../services/notification.service';
import { HeaderItem } from '../dialog-stubb-headers/dialog-stubb-headers.component';
import styles from './dialog-stubb-header.component.less';

@Component({
	selector: 'h-dialog-stubb-header',
	template: require('./dialog-stubb-header.component.html'),
	styles: [styles],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogStubbHeaderComponent {
	public text: string;
	public readonly title: string;
	public readonly hasData: boolean;

	constructor(
		private readonly dialogRef: MatDialogRef<DialogStubbHeaderComponent>,
		private readonly notification: NotificationService,
		@Inject(MAT_DIALOG_DATA) private readonly data?: HeaderItem
	) {
		this.hasData = !!data;
		this.title = data ? data.header : 'Header name';
		this.text = data ? data.value : '';
	}

	public cancelDialog(): void {
		this.dialogRef.close();
	}

	public closeDialog(text: string): void {
		const isHeaderTitle = !this.data;

		if (isHeaderTitle && !text) {
			this.notification.showMessage('Header title should not be empty 🛑');
			return;
		}

		this.dialogRef.close(text);
	}
}

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule],
	declarations: [DialogStubbHeaderComponent],
	exports: [DialogStubbHeaderComponent],
	entryComponents: [DialogStubbHeaderComponent]
})
export class DialogStubbHeaderComponentModule {}
