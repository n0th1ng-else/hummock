import { Logger } from '../server/log';
import { validate } from './validate';
import { downloadWiremock } from '../server/wiremock/index';

const logger = new Logger('launcher');

export function run() {
    const config = validate();
    downloadWiremock(config.wiremock);
}