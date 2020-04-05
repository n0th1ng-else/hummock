import * as chalk from 'chalk';

export function pGreen(message: string): string {
	return chalk.green(message);
}

export function pRed(message: string): string {
	return chalk.red(message);
}

export function pYellow(message: string): string {
	return chalk.yellow(message);
}

export class Logger {
	constructor(private readonly domain?: string) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public info(...data: any): void {
		console.log(pGreen(this.getDomain()), ...data);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public warn(...data: any): void {
		console.log(pYellow(this.getDomain()), ...data);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
