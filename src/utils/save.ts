import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const proxyListPath = join(process.cwd(), 'proxies.txt');
const emailListPath = join(process.cwd(), 'emails.txt');
const savePath = join(process.cwd(), 'orders.txt');

export function saveAccount({ email, password }: { email: string; password: string; }): void {

    const string = [email, password].join(':') + '\n';

    appendFileSync(savePath, string, 'utf-8');
};

export function getOrders(): string[] {
    return readFileSync(savePath, 'utf8').replace(/\r/g, '').split('\n')
}

export function saveOrder({ OrderID, lastName, other = '' }: { OrderID: string; lastName: string; other?: string }): void {

    const string = `${OrderID}:${lastName}:${other}\n`;

    appendFileSync(savePath, string, 'utf-8');
};

export function removeOrder(order: string) {
    let old = getOrders()
    let updated = old.filter(o => o !== order)
    writeFileSync(savePath, updated.join('\n'), 'utf-8')
}


export function proxyList(): void {
    if (!existsSync(proxyListPath)) appendFileSync(proxyListPath, '', 'utf-8');
};

export function readProxies(): string[] {
    return readFileSync(proxyListPath, 'utf-8').replace(/\r/g, '').split('\n');
}
