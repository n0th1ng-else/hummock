import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';

require('@angular/material/prebuilt-themes/deeppurple-amber.css');

@NgModule({
	exports: [
		MatButtonModule,
		MatCardModule,
		MatToolbarModule,
		MatIconModule,
		MatCheckboxModule,
		MatBadgeModule
	]
})
export class MaterialModule {}
