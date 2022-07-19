import got from 'got';
import { genTaskId } from 'utils/tools';
import proxyHandler from './proxy';
import { taskLog, colors, create } from 'utils/logger';
import { CookieJar } from 'tough-cookie';
import { readProxies } from 'utils/save';

const { log, debug, error } = create('base');

export default class base {
    task_id: string;
    CookieJar: CookieJar;
    proxy: proxyHandler | false;
    colors: { red: string; blue: string; green: string; yellow: string };
    _task_id: string;
    _module: string;
    proxyList: string[];
    __throwHTTPError: boolean;
    defaultOptions: {};
    constructor({ module = 'Dev', task_id = genTaskId(), useProxies = false }: Module) {
        this._task_id = task_id;
        this._module = module;
        this.colors = colors;
        this.CookieJar = new CookieJar();
        this.proxy = useProxies ? new proxyHandler(this.proxyList = readProxies()) : false;
        this.defaultOptions = {}
        this.__throwHTTPError = true;
    };

    log(msg: string, color = '#add8e6'): void {
        this.task_id = `${this._module}-${this._task_id}`;
        taskLog({
            color,
            msg,
            id: this.task_id
        })
    }

    async request(url: string, options = this.defaultOptions) {
        if ((!options['headers'] && this.defaultOptions['headers'])) {
            options['headers'] = this.defaultOptions['headers'];
        }

        return got({
            url,
            cookieJar: this.CookieJar,
            agent: this.proxy ? this.proxy.agent : false,
            timeout: options['timeout'] || 30000,
            throwHttpErrors: this.__throwHTTPError,
            ...options,
        });
    };

};