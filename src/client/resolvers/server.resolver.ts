import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationService } from '../services/navigation.service';
import { NotificationService } from '../services/notification.service';
import { ServerModel } from '../models/server';
import { CommandService } from '../services/command.service';

@Injectable({ providedIn: 'root' })
export class ServerResolver implements Resolve<ServerModel> {
	constructor(
		private readonly navigation: NavigationService,
		private readonly api: CommandService,
		private readonly notification: NotificationService
	) {}

	public resolve(route: ActivatedRouteSnapshot): Observable<ServerModel> {
		const id = route.paramMap.get('hostId');
		return this.api.getProxy(id).pipe(
			catchError(err => {
				this.notification.showMessage(`Host with id=${id} not found 🌑`);
				this.navigation.toHome();
				throw err;
			})
		);
	}
}
