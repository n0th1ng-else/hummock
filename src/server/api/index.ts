import { Application as ExpressApp, Request, Response, Router } from 'express';
import { HummockConfig } from '../../models/config';
import { Logger, pGreen, pYellow } from '../log';
import { getLaunchers, LauncherService } from '../launcher';
import { ServerToggleDto, StubbDetailsDto } from '../../models/types';

const logger = new Logger('api');

function showNotFound(req: Request, res: Response): void {
	res.status(404).send({
		message: 'Not found'
	});
}

class ApiRouter {
	public readonly router = Router();

	private readonly launchers: LauncherService[];

	constructor(private readonly config: HummockConfig) {
		this.launchers = getLaunchers(config);
		this.handleRoutes();
	}

	public stopAll(): Promise<void> {
		return Promise.all(this.launchers.map(launcher => launcher.stop())).then(() => {
			// Make single void as the result
		});
	}

	public startAll(): Promise<void> {
		return Promise.all(this.launchers.map(launcher => launcher.start())).then(() => {
			// Make single void as the result
		});
	}

	private handleRoutes(): void {
		this.router.get('/config', (req: Request, res: Response) => {
			res.status(200).send(this.config);
		});

		this.router.get('/proxies', (req: Request, res: Response) => {
			Promise.all(this.launchers.map(launcher => launcher.getListDto()))
				.then(items => {
					res.status(200).send({
						total: this.config.servers.length,
						items
					});
				})
				.catch(err => {
					logger.error(err);
					res.status(500).send({ message: 'Something went wrong' });
				});
		});

		this.router.get('/proxies/:proxyId', (req: Request, res: Response) => {
			const id = req.params.proxyId;
			const launcher = this.launchers.find(instance => instance.server.id === id);

			if (!launcher) {
				res.status(404).send({ message: `Host with id=${id} not found` });
				return;
			}

			launcher
				.getDto()
				.then(dto => {
					res.status(200).send(dto);
				})
				.catch(err => {
					logger.error(err);
					res.status(500).send({ message: 'Something went wrong' });
				});
		});

		this.router.put('/proxies/:proxyId/stubb/:stubbId', (req: Request, res: Response) => {
			const id = req.params.proxyId;
			const stubbData: StubbDetailsDto = req.body;

			const launcher = this.launchers.find(instance => instance.server.id === id);

			if (!launcher) {
				res.status(404).send({ message: `Host with id=${id} not found` });
				return;
			}

			const wasLaunched = launcher.isLaunched();
			launcher
				.stop()
				.then(() => launcher.updateStubb(stubbData))
				.then(() => wasLaunched && launcher.start())
				.then(() => res.status(200).send({}))
				.catch(err => {
					logger.error(err);
					res
						.status(500)
						.send({ message: `Unable to update stubb ${stubbData.name} for id ${id}` });
				});
		});

		this.router.delete('/proxies/:proxyId/stubb/:stubbId', (req: Request, res: Response) => {
			const id = req.params.proxyId;
			const stubbId = decodeURIComponent(req.params.stubbId);

			const launcher = this.launchers.find(instance => instance.server.id === id);

			if (!launcher) {
				res.status(404).send({ message: `Host with id=${id} not found` });
				return;
			}

			const wasLaunched = launcher.isLaunched();
			launcher
				.stop()
				.then(() => launcher.deleteStubb(stubbId))
				.then(() => wasLaunched && launcher.start())
				.then(() => res.status(200).send({}))
				.catch(err => {
					logger.error(err);
					res.status(500).send({ message: `Unable to delete stubb ${stubbId} for id ${id}` });
				});
		});

		this.router.post('/proxies', (req: Request, res: Response) => {
			const toggleData: ServerToggleDto = req.body;

			logger.info(!toggleData.run ? 'Stopping mock servers 🌑' : 'Starting mock servers 🌕');

			Promise.all(
				toggleData.ids.map(id => {
					const launcher = this.launchers.find(item => item.server.id === id);
					if (!launcher) {
						logger.warn(pYellow(`Unable to toggle launcher with id=${id}`));
					}
					return toggleData.run ? launcher.start() : launcher.stop();
				})
			)
				.then(() => {
					logger.info(
						pGreen('All good ✨'),
						this.launchers.map(launcher => launcher.state)
					);
					res.status(200).send({});
				})
				.catch(err => {
					logger.error(err);
					res.status(500).send({ message: 'Something went wrong' });
				});
		});

		this.router.all('/*', showNotFound);
	}
}

export function pickApiRoutes(app: ExpressApp, config: HummockConfig): Promise<ApiRouter> {
	const apiRouter = new ApiRouter(config);
	app.use('/api/v0', apiRouter.router);
	app.all('/api/*', showNotFound);
	return config.autostart ? apiRouter.startAll().then(() => apiRouter) : Promise.resolve(apiRouter);
}
