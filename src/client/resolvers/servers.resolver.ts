import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServersMeta } from '../models/server';
import { CommandService } from '../services/command.service';

@Injectable({ providedIn: 'root' })
export class ServersResolver implements Resolve<ServersMeta> {
	constructor(private readonly api: CommandService) {}

	public resolve(): Observable<ServersMeta> {
		return this.api.getProxies();
	}
}
