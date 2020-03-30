import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, AppComponentModule } from '../components/app/app.component';

@NgModule({
	imports: [BrowserModule, HttpClientModule, AppComponentModule],
	declarations: [],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: []
})
export class AppModule {}
