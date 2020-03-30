import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable } from 'rxjs';
import { ServersDto, Dictionary } from '../models/types';

@Injectable({ providedIn: 'root' })
export class CommandService {
	constructor(private readonly rest: RestService) {}

	public getConfig() {
		return this.rest.getConfig();
	}

	public getProxies(): Observable<ServersDto> {
		return this.rest.getProxies();
	}

	public toggleService(state: Dictionary<boolean>): Observable<void> {
		return this.rest.toggleService(state);
	}
}
