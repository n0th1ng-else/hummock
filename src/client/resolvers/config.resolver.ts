import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandService } from '../services/command.service';

@Injectable({ providedIn: 'root' })
export class ConfigResolver implements Resolve<object> {
	constructor(private readonly api: CommandService) {}

	public resolve(): Observable<object> {
		return this.api.getConfig();
	}
}
