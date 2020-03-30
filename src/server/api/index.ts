import { Application, Request, Response, NextFunction, Router } from 'express';
import { HummockConfig } from '../../models/config';

export function pickApiRoutes(app: Application, config: HummockConfig) {
	const apiRouter = new ApiRouter(config);
	app.use('/api/v0', apiRouter.router);
}

class ApiRouter {
	public readonly router = Router();

	constructor(private readonly config: HummockConfig) {
		this.router.get('/config', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send(this.config);
		});
	}
}
