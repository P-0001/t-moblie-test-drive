import chalk from 'chalk';
import { createWriteStream, WriteStream } from 'fs';
import { format } from "util";
import { logPath } from "./paths"
import { formatDate } from './time'

export const isDev = process.env.isDev == 'true'

let _logDebug = (...data: any[]) => { };

if (isDev) _logDebug = console.debug;

let logStream: WriteStream;

async function writeLog(msg: string): Promise<void> {
    if (!logStream) {
        logStream = createWriteStream(logPath, {
            encoding: 'utf-8',
            'flags': 'a',
            autoClose: false
        });
    }
    if (logStream.writable) {
        await new Promise(async (resolve, reject) => {
            let times = 0;
            setInterval(async () => {
                times++;
                if (logStream.writable)
                    resolve('');

                if (times > 10)
                    reject(new Error('Could not write to log file, Retry Maxed Out'));
            }, 500);
        });
    }
    logStream.write(msg + "\n");
}

export const colors = {
    red: '#ed1313',
    blue: "#add8e6",
    green: "#3DD6AA",
    yellow: "#FFD700",
    '#ed1313': 'Error',
    '#add8e6': 'Info',
    '#3DD6AA': 'Debug',
    '#FFD700': 'Warn',
};

const colorsToLog = {
    '#ed1313': console.error,
    '#add8e6': console.info,
    '#3DD6AA': console.log,
    '#FFD700': console.warn,
}

const normal = chalk.hex(colors.blue);
const red = chalk.hex(colors.red);
const warn = chalk.hex(colors.yellow);
const success = chalk.hex(colors.green);

const getTime = () => formatDate("{LT}.{ms}", new Date());

function fmt(args: any[], lvl: string, name = "Emerald-Cli"): string {

    return `[${getTime()}] | ${lvl} | ${name} | ${format(...args)}`
}

interface TaskLog {
    color?: string,
    msg?: string,
    id?: string
}

export function taskLog({ color = colors.blue, msg = 'Null', id = '' }: TaskLog): void {
    const logger = typeof colorsToLog[color] === 'function' ? colorsToLog[color] : console.log;
    let time = `[${getTime()}]`;
    const toC = chalk.hex(color);
    logger(`${chalk.grey(time)} | ${toC(color == colors.green ? '!!!' : colors[color])} | ${chalk.magentaBright(`Task:${id}`)} | ${toC(msg)}`)
    writeLog(`${time} | ${colors[color]} | Task:${id} | ${msg}`)
}


export function create(name = "ID"): { error: (...args: any) => void; log: (...args: any) => void; debug: (...args: any) => void; } {
    const Fmt = (args: any, lvl: string) => fmt(args, lvl, name);
    return {
        error: function (...args: any) {
            let msg = Fmt(args, 'Error')
            console.error(red(msg))
            writeLog(msg)
        },
        log: function (...args: any) {
            let msg = Fmt(args, 'Info');
            console.log(normal(msg));
            writeLog(msg);
        },
        debug: function (...args: any) {
            let msg = Fmt(args, 'Debug');
            _logDebug(warn(msg));
        }
    }
}