import { Logger } from '../server/log';
import { validate } from './validate';

const logger = new Logger();

export function run() {
    const config = validate();
    logger.info(config)
}