import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
	constructor(private readonly snackBar: MatSnackBar) {}

	public showMessage(message: string): void {
		this.snackBar.open(message, null, { duration: 2000 });
	}
}
