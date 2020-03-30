import { Application, Request, Response, NextFunction, Router } from 'express';
import { HummockConfig } from '../../models/config';

export function pickApiRoutes(app: Application, config: HummockConfig) {
	const apiRouter = new ApiRouter(config);
	app.use('/api/v0', apiRouter.router);

	app.all('/*', (req: Request, res: Response, next: NextFunction) => {
		res.status(404).send({
			message: 'Not found'
		});
	});
}

class ApiRouter {
	public readonly router = Router();

	constructor(private readonly config: HummockConfig) {
		this.router.get('/config', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send(this.config);
		});

		this.router.get('/proxies', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send({
				total: config.servers.length,
				items: config.servers
			});
		});

		this.router.all('/*', (req: Request, res: Response, next: NextFunction) => {
			res.status(404).send({
				message: 'Not found'
			});
		});
	}
}
