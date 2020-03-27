import * as express from 'express';
import { Logger, pGreen } from '../log';

const logger = new Logger('express');

export async function startServer(port = 3000): Promise<void> {
    return new Promise((resolve, reject) => {
        const app = express();

        app.get('/', (req, res) => {
          res.send('Hello World!');
        });
        
        app.listen(port, () => {
            logger.info(`${pGreen('Server started.')} Go visit http://localhost:${port} 🚀`);
            resolve();
        });
    })
}
