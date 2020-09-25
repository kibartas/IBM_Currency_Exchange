// Re-fetches lb.lt information on 4 AM everyday
import schedule from 'node-schedule';
import {initDBInformation} from '../db/startup';

export const scheduleDBRePopulation = () => schedule.scheduleJob('0 4 * * *', () => async () => initDBInformation());
