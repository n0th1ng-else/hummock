import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from '../pages/config/config.component';
import { HomeComponent } from '../pages/home/home.component';
import { HostComponent } from '../pages/host/host.component';
import { ServerResolver } from '../resolvers/server.resolver';

const appRoutes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'config',
		component: ConfigComponent
	},
	{
		path: 'host/:hostId',
		component: HostComponent,
		resolve: {
			server: ServerResolver
		}
	},
	{
		path: '**',
		redirectTo: '/'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes, {
			// enableTracing: !runtime.isProductionMode
			// preloadingStrategy: SelectivePreloadingStrategy,
		})
	],
	exports: [RouterModule],
	providers: [
		// CanDeactivateGuard,
		// SelectivePreloadingStrategy
	]
})
export class AppRoutingModule {}
