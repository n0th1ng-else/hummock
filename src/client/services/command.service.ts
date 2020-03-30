import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

@Injectable({ providedIn: 'root' })
export class CommandService {
	constructor(private readonly rest: RestService) {}

	public getConfig() {
		return this.rest.getConfig();
	}

	public getProxies() {
		return this.rest.getProxies();
	}
}
