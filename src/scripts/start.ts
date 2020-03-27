import { Logger } from '../server/log';
import { validate } from './validate';
import { downloadWiremock } from '../server/wiremock/index';
import { startServer } from '../server/express';

const logger = new Logger('launcher');

export async function run() {
    const config = validate();
    await downloadWiremock(config.wiremock);
    await startServer();
}