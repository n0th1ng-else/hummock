import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RestService } from '../services/rest.service';
import { NavigationService } from '../services/navigation.service';
import { NotificationService } from '../services/notification.service';

@Injectable({ providedIn: 'root' })
export class ServerResolver implements Resolve<{}> {
	constructor(
		private readonly navigation: NavigationService,
		private readonly api: RestService,
		private readonly notification: NotificationService
	) {}

	public resolve(route: ActivatedRouteSnapshot): Observable<{}> {
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
