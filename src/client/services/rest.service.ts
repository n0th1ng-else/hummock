import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
	ServerToggleDto,
	ServerListDto,
	ServerDetailsDto,
	StubbDetailsDto
} from '../../models/types';

@Injectable({ providedIn: 'root' })
export class RestService {
	private readonly apiPath = 'api';
	private readonly version = 'v0';

	constructor(private readonly http: HttpClient) {}

	public getConfig() {
		return this.http.get(this.getPath('config'));
	}

	public getProxies(): Observable<ServerListDto> {
		return this.http.get<ServerListDto>(this.getPath('proxies'));
	}

	public getProxy(id: string): Observable<ServerDetailsDto> {
		return this.http.get<ServerDetailsDto>(this.getPath(['proxies', id]));
	}

	public updateStubb(id: string, data: StubbDetailsDto): Observable<void> {
		return this.http.put<void>(this.getPath(['proxies', id]), data);
	}

	public toggleService(state: ServerToggleDto): Observable<void> {
		return this.http.post<void>(this.getPath('proxies'), state);
	}

	private getPath(path: string | string[]): string {
		const parts = typeof path === 'string' ? [path] : path;
		return ['', this.apiPath, this.version, ...parts].join('/');
	}
}
