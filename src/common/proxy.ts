import { HttpsProxyAgent, HttpProxyAgent } from 'hpagent';

class proxyHandler {
    rawList: Array<string>;
    proxyList: ProxyList;
    proxy: proxy;

    constructor(list: Array<string>) {
        if (typeof list !== 'object') throw new TypeError('Invalid ProxyList Supplied');
        if (list.length == 0) throw new Error('Array Empty');
        this.proxyList = [];
        this.rawList = list;
        this.makeList(list);
        this.proxy = this.RandomProxy();
        this.proxyList.sort(() => Math.random() - 0.5)
    }

    get proxyID() {
        return `${this.proxy.number + 1}`.padStart(4, '0');
    }

    get agent() {
        return {
            http: new HttpProxyAgent({ proxy: this.proxy.url }),
            https: new HttpsProxyAgent({ proxy: this.proxy.url })
        };
    }

    get proxyUrl() {
        return this.proxy.url;
    }

    get list() {
        return this.proxyList;
    }

    randomIndex() {
        return this.proxyList.indexOf(this.proxyList.find(proxy => !proxy.status.used));
    }

    get Readable() {
        return this.rawList[this.proxy.number];
    }

    get isAllUsed() {
        const arr = this.proxyList.filter(proxy => proxy.status.used);
        return arr.length == this.proxyList.length;
    }

    change(): void {
        if (this.isAllUsed) {
            console.debug('All Proxies Used');
        };

        if (this.proxy) {
            if (this.proxy.proxy.host != 'proxy.packetstream.io')
                this.proxy.status.used = true;
        };

        this.proxy = this.proxyList[this.randomIndex()];
    }

    toUrl(proxy: string): string {
        let arr = proxy.split(":");

        if (arr[2] && arr[3]) {
            return `http://${arr[2]}:${arr[3]}@${arr[0]}:${arr[1]}`;
        } else {
            return `http://${proxy}`
        };
    };

    parser(proxy: string): Proxy {
        let arr = proxy.split(":");
        if (arr[2] && arr[3]) {
            return {
                host: arr[0],
                port: arr[1],
                username: arr[2],
                password: arr[3],
            };
        } else {
            return {
                host: arr[0],
                port: arr[1],
            };
        }
    }

    makeList(list: Array<string>) {
        // loop through proxy list
        for (let i = 0; i < list.length; i++) {

            if (list[i].length == 0 || !list[i].includes(':')) {
                continue;
                // throw new Error(`Invalid Proxy ${list[i]}`);
            };

            this.proxyList.push({
                url: this.toUrl(list[i]),
                proxy: this.parser(list[i]),
                status: {
                    used: false
                },
                number: i
            });
        };

    };

    RandomProxy() {
        return this.proxyList[this.randomIndex()];
    };

    banned(): void {
        if (this.proxy.proxy.host != 'proxy.packetstream.io') this.proxyList = this.proxyList.splice(this.proxy.number, 1);
        this.change();
    };

};

export default proxyHandler;