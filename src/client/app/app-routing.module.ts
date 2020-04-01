import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from '../pages/config/config.component';
import { HomeComponent } from '../pages/home/home.component';
import { HostComponent } from '../pages/host/host.component';
import { ServerResolver } from '../resolvers/server.resolver';
import { ServersResolver } from '../resolvers/servers.resolver';
import { ConfigResolver } from '../resolvers/config.resolver';

const appRoutes: Routes = [
	{
		path: '',
		component: HomeComponent,
		resolve: {
			servers: ServersResolver
		}
	},
	{
		path: 'config',
		component: ConfigComponent,
		resolve: {
			config: ConfigResolver
		}
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
