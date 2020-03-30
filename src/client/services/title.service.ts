import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TitleService {
	constructor(private readonly title: Title) {}

	public setTitle(title?: string): void {
		this.title.setTitle(this.formTitle(title));
	}

	private formTitle(title?: string): string {
		if (!title) {
			return 'Hummock WebUI';
		}

		return `Hummock | ${title}`;
	}
}
