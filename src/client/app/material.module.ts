import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

require('@angular/material/prebuilt-themes/deeppurple-amber.css');

@NgModule({
	exports: [MatButtonModule, MatCardModule]
})
export class MaterialModule {}
