import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable } from 'rxjs';
import { ServersDto, Dictionary } from '../models/types';
import { ServersMeta, ServerModel } from '../models/server';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CommandService {
	constructor(private readonly rest: RestService) {}

	public getConfig() {
		return this.rest.getConfig();
	}

	public getProxies(): Observable<ServersMeta> {
		return this.rest.getProxies().pipe(
			map((servers) => {
				const items = servers.items.map(
					(item) => new ServerModel(item.id, item.host, item.port, item.state, item.stubbs)
				);
				return new ServersMeta(servers.total, items);
			})
		);
	}

	public toggleService(state: Dictionary<boolean>): Observable<void> {
		return this.rest.toggleService(state);
	}
}
