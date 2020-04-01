import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigationService } from '../services/navigation.service';
import { NotificationService } from '../services/notification.service';
import { ServersMeta } from '../models/server';
import { CommandService } from '../services/command.service';

@Injectable({ providedIn: 'root' })
export class ServersResolver implements Resolve<ServersMeta> {
	constructor(
		private readonly navigation: NavigationService,
		private readonly api: CommandService,
		private readonly notification: NotificationService
	) {}

	public resolve(route: ActivatedRouteSnapshot): Observable<ServersMeta> {
		const id = route.paramMap.get('hostId');
		return this.api.getProxies();
	}
}
