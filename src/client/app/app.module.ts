import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, AppComponentModule } from '../components/app/app.component';

@NgModule({
	imports: [BrowserModule, AppComponentModule],
	declarations: [],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: []
})
export class AppModule {}
