import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

require('@angular/material/prebuilt-themes/deeppurple-amber.css');

@NgModule({
	exports: [
		MatButtonModule,
		MatCardModule,
		MatToolbarModule,
		MatIconModule,
		MatCheckboxModule,
		MatBadgeModule,
		MatSnackBarModule,
		MatTreeModule,
		MatExpansionModule,
		MatDividerModule,
		MatListModule,
		MatInputModule,
		MatDialogModule
	]
})
export class MaterialModule {}
