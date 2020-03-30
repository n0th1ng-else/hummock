import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RestService {
	private readonly apiPath = 'api';
	private readonly version = 'v0';
	constructor(private readonly http: HttpClient) {}

	public getConfig() {
		return this.http.get(this.getPath('config'));
	}

	public getProxies() {
		return this.http.get(this.getPath('proxies'));
	}

	private getPath(path: string | string[]): string {
		const parts = typeof path === 'string' ? [path] : path;
		return ['', this.apiPath, this.version, ...parts].join('/');
	}
}
