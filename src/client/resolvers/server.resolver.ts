import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '../services/rest.service';

@Injectable({ providedIn: 'root' })
export class ServerResolver implements Resolve<{}> {
	constructor(private readonly api: RestService) {}

	public resolve(route: ActivatedRouteSnapshot): Observable<{}> {
		const id = route.paramMap.get('hostId');
		return this.api.getProxy(id);
	}
}
