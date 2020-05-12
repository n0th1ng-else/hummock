import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../app/material.module';

@Component({
	selector: 'h-dialog-stubb-delete',
	template: require('./dialog-stubb-delete.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogStubbDeleteComponent {
	constructor(public readonly dialogRef: MatDialogRef<DialogStubbDeleteComponent>) {}

	public closeDialog(shouldDelete?: boolean): void {
		this.dialogRef.close(shouldDelete);
	}
}

@NgModule({
	imports: [CommonModule, FormsModule, MaterialModule],
	declarations: [DialogStubbDeleteComponent],
	exports: [DialogStubbDeleteComponent],
	entryComponents: [DialogStubbDeleteComponent]
})
export class DialogStubbDeleteComponentModule {}
