import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServersMeta, ServerModel } from '../models/server';
import { RestService } from './rest.service';
import { ServerToggleDto, StubbDetailsDto } from '../../models/types';

@Injectable({ providedIn: 'root' })
export class CommandService {
	constructor(private readonly rest: RestService) {}

	public getConfig() {
		return this.rest.getConfig();
	}

	public getProxies(): Observable<ServersMeta> {
		return this.rest.getProxies().pipe(
			map(servers => {
				const items = servers.items.map(
					item => new ServerModel(item.id, item.host, item.port, item.state, item.stubbs.total)
				);
				return new ServersMeta(servers.total, items);
			})
		);
	}

	public getProxy(id: string): Observable<ServerModel> {
		return this.rest
			.getProxy(id)
			.pipe(
				map(
					server =>
						new ServerModel(
							server.id,
							server.host,
							server.port,
							server.state,
							server.stubbs.total,
							server.stubbs.items
						)
				)
			);
	}

	public updateStubb(id: string, data: StubbDetailsDto): Observable<void> {
		return this.rest.updateStubb(id, data);
	}

	public toggleService(state: ServerToggleDto): Observable<void> {
		return this.rest.toggleService(state);
	}
}
