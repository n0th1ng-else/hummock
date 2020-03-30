import { Application, Request, Response, NextFunction, Router } from 'express';
import { HummockConfig } from '../../models/config';

export function pickApiRoutes(app: Application, config: HummockConfig) {
	const apiRouter = new ApiRouter(config);
	app.use('/api/v0', apiRouter.router);
	app.all('/api/*', showNotFound);
}

class ApiRouter {
	public readonly router = Router();

	constructor(private readonly config: HummockConfig) {
		this.handleRoutes();
	}

	private handleRoutes() {
		this.router.get('/config', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send(this.config);
		});

		this.router.get('/proxies', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send({
				total: this.config.servers.length,
				items: this.config.servers
			});
		});

		this.router.all('/*', showNotFound);
	}
}

function showNotFound(req: Request, res: Response) {
	res.status(404).send({
		message: 'Not found'
	});
}
