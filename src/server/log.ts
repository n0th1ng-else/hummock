import * as chalk from 'chalk';

export class Logger {
	constructor(private readonly domain?: string) {}

	public info(...data: any): void {
		console.log(pGreen(this.getDomain()), ...data);
	}

	public warn(...data: any): void {
		console.log(pYellow(this.getDomain()), ...data);
	}

	public error(...data: any): void {
		console.log(pRed(this.getDomain()), ...data);
	}

	private getDomain(): string {
		if (!this.domain) {
			return '';
		}

		return `[${this.domain}]`;
	}
}

export function pRed(message: string): string {
	return chalk.red(message);
}

export function pYellow(message: string): string {
	return chalk.yellow(message);
}

export function pGreen(message: string): string {
	return chalk.green(message);
}
