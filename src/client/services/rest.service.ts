import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServersDto, Dictionary } from '../models/types';

@Injectable({ providedIn: 'root' })
export class RestService {
	private readonly apiPath = 'api';
	private readonly version = 'v0';
	constructor(private readonly http: HttpClient) {}

	public getConfig() {
		return this.http.get(this.getPath('config'));
	}

	public getProxies(): Observable<ServersDto> {
		return this.http.get<ServersDto>(this.getPath('proxies'));
	}

	public toggleService(state: Dictionary<boolean>): Observable<void> {
		return this.http.post<void>(this.getPath('proxies'), state);
	}

	private getPath(path: string | string[]): string {
		const parts = typeof path === 'string' ? [path] : path;
		return ['', this.apiPath, this.version, ...parts].join('/');
	}
}
