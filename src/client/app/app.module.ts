import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, AppComponentModule } from '../components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	imports: [BrowserModule, HttpClientModule, AppComponentModule, BrowserAnimationsModule],
	declarations: [],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: []
})
export class AppModule {}
