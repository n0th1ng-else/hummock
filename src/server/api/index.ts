import { Application, Request, Response, NextFunction, Router } from 'express';
import { HummockConfig } from '../../models/config';
import { Logger, pGreen } from '../log';
import { ServerForRecordState } from '../../config';

const logger = new Logger();

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
				items: this.config.servers.map((server) => ({
					id: server.id,
					stubbs: server.stubbs,
					state: server.state,
					host: server.host,
					port: server.port
				}))
			});
		});

		this.router.post('/proxies', (req: Request, res: Response, next: NextFunction) => {
			const isRunning = this.config.servers.find(
				(server) => server.state === ServerForRecordState.RUN
			);

			Promise.all(
				this.config.servers.map((server) => (isRunning ? server.stop() : server.start()))
			).then(() => {
				logger.info(
					pGreen('all good'),
					this.config.servers.map((server) => server.state)
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
