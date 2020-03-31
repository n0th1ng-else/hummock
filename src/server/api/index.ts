import { Application, Request, Response, NextFunction, Router } from 'express';
import { HummockConfig } from '../../models/config';
import { Logger, pGreen } from '../log';
import { ServerForRecordState } from '../../config';
import { getLaunchers, LauncherService } from '../launcher';

const logger = new Logger('api');

export function pickApiRoutes(app: Application, config: HummockConfig) {
	const apiRouter = new ApiRouter(config);
	app.use('/api/v0', apiRouter.router);
	app.all('/api/*', showNotFound);
}

class ApiRouter {
	public readonly router = Router();

	private readonly launchers: LauncherService[];

	constructor(private readonly config: HummockConfig) {
		this.launchers = getLaunchers(config);
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

		this.router.post('/proxies', (req: Request, res: Response, next: NextFunction) => {
			const isRunning = this.launchers.find((server) => server.state === ServerForRecordState.RUN);

			Promise.all(
				this.launchers.map((launcher) => (isRunning ? launcher.stop() : launcher.start()))
			).then(() => {
				logger.info(
					pGreen('all good'),
					this.launchers.map((launcher) => launcher.state)
				);
				res.status(200).send({});
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
