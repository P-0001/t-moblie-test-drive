import { join } from 'path';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { proxyList, readProxies } from './save';
import { logDate } from './time';
const name = `${logDate}.log`;
const logDir = join(process.cwd(), 'logs');
export const logPath = join(logDir, name);
export const taskPath = join(process.cwd(), 'task.json');

if (!existsSync(logDir)) mkdirSync(logDir);
if (!existsSync(logPath)) writeFileSync(logPath, '', 'utf-8');
proxyList()
export { readProxies }

export function checkTask(): boolean {
    if (!existsSync(taskPath)) {

        const base = {
            profile: {
                "address1": "",
                "city": "",
                "zipCode": "",
                "stateCode": "",
                "address2": ""
            },
            domain: '',
            useProxies: false,
            sendHook: false,
            webhook: '',
            mode: 'order',
        } as globalThis.taskDataTMobile;

        writeFileSync(taskPath, JSON.stringify(base, null, 4), 'utf-8');

        return false;
    } else {
        const task = JSON.parse(readFileSync(taskPath, 'utf-8')) as taskDataTMobile;

        return (task.profile.address1 && task.profile.city && task.profile.zipCode && task.profile.stateCode) ? true : false;
    }
}

export function getTask(): taskDataTMobile {
    return JSON.parse(readFileSync(taskPath, 'utf-8')) as taskDataTMobile;
}