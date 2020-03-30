import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
	constructor(private readonly router: Router) {}

	public toHostDetails(hostId: string): void {
		this.router.navigate(['host', hostId]);
	}

	public toHome(): void {
		this.router.navigate(['']);
	}

	public toConfig(): void {
		this.router.navigate(['config']);
	}
}
