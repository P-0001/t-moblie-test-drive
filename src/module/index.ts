import { create } from "utils/logger";
import base from "common/base";
import { checkOrderAuthUrl, checkOrderAuthOptions, dataUrl, getOptions, oAuthUrl, postOptionsBasic, orderUrl, checkOrderOptions, postOptionsBearer, addressUrl, postOptionsBearerAddress, confirmUrl, confirmOptions } from "./extras";
import { getOrders, removeOrder, saveOrder } from "utils/save";
import { sendHook } from "utils/webhook";

const { log, debug, error } = create('t-mobile');

export class tMobile extends base {
    basicAuth: string;
    accessToken: string;
    profile: Profile
    extraAddress: { zipExtension: string; geoCode: string; };
    domain: string;
    orderID: string;
    checkAuth: string;
    webhook: { url: string; UseHook: boolean; };
    orderData: orderData;
    transactionId: string;
    constructor(task: taskDataTMobile) {
        super({
            module: `T-Mobile|${task.mode[0].toUpperCase()}${task.mode.slice(1)}`,
            useProxies: task.useProxies,
        })
        this.webhook = {
            url: task.webhook,
            UseHook: task.sendHook,
        }
        this.profile = task.profile;
        this.domain = task.domain;

        this.log(`Starting With Proxy: ${typeof this.proxy != 'boolean' ? this.proxy.Readable : 'None'}`)
    }

    async getPreData() {
        try {
            this.log('Generating Credentials')
            const res = await this.request(dataUrl, getOptions());

            const { username, password } = JSON.parse(res.body.split('"zipWhip":')[1].split('}')[0] + '}');

            // debug('getPreData ==>', username, password)

            if ((username && password) && (username.length > 1 && password.length > 1)) {
                this.basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
                this.log('Generated Credentials!', this.colors.green)
                return true
            } else {
                this.log('Failed To Generate Credentials...', this.colors.red)
            }
        } catch (err) {
            debug(err)
            this.log(`Failed To Generate Credentials...`, this.colors.red)
        }
        return false

    }

    async getAuthToken() {
        try {
            this.log('Generating Auth Token')
            const res = await this.request(oAuthUrl, postOptionsBasic(this.basicAuth));
            //  debug('service-transaction-id:', res.headers['service-transaction-id'])
            this.transactionId = res.headers['service-transaction-id'] as string;
            // debug('body => body ==>', body)
            let parsed = JSON.parse(res.body) as AuthTokenRequestBody
            const { access_token } = parsed;
            if (typeof access_token === 'string' && access_token.length > 1) {
                this.accessToken = access_token
                this.log('Access Token Generated!', this.colors.green)
                return true
            } else {
                this.log('Failed To Generate Access Token...', this.colors.red)
            }
        } catch (err) {
            debug(err)
            this.log('Failed To Generate Access Token...', this.colors.red)
        }
        //   debug('getAuthToken => access_token ==>', access_token)
        return false
    }

    async getAddressInfo() {
        try {
            this.log('Getting Address Code')
            let options = postOptionsBearerAddress(this.accessToken, this.profile)
            const res = await this.request(addressUrl, options);
            const addressData = JSON.parse(res.body)
            debug('getAddressInfo => addressData ==>', addressData)
            if (addressData.addresses) {
                let address = addressData.addresses[0]
                this.extraAddress = {
                    // cspell: disable next-line
                    zipExtension: address.postalcodeextension,
                    geoCode: address.geocode,
                }
                this.log('Address Code Generated!', this.colors.green)
                //  debug('getAddressInfo => address ==>', this.extraAddress)
                return true
            } else {
                debug(`getAddressInfo =>`, addressData)
                this.log(`Address Code Failed...`, this.colors.red)
            }
        } catch (err) {
            debug(err)
            this.log(`Address Code Failed...`, this.colors.red)
        }
        return false
    }

    async placeOrder() {
        try {
            this.log('Placing Order...')
            let options = postOptionsBearer({
                accessToken: this.accessToken, data: {
                    address: {
                        ...this.profile,
                        ...this.extraAddress,
                        countryCode: 'USA',
                    },
                    domain: this.domain
                },
                transactionId: this.transactionId,
            })
            const res = await this.request(orderUrl, options);
            let resBody = JSON.parse(res.body);
            if (resBody.orderId) {
                let json = JSON.parse(options.body)
                // debug('placeOrder => reqBody ==>', JSON.parse(options.body))
                let last = json['customerProfile']['lastName'];
                let bodyDataB64 = Buffer.from(JSON.stringify({
                    orderId: resBody.orderId,
                    ...json,
                })).toString('base64')

                this.log(`Order Placed! Order Id: ${resBody.orderId}:${last}`, this.colors.green)
                this.orderID = resBody.orderId;
                this.orderData = {
                    orderId: resBody.orderId as string,
                    email: json.customerProfile.email as string,
                    firstName: json.customerProfile.firstName as string,
                    lastName: json.customerProfile.lastName as string,
                    proxy: (this.proxy ? this.proxy.Readable : 'None'),
                    data: bodyDataB64
                }
                saveOrder({ OrderID: this.orderID, lastName: last, other: bodyDataB64 })
                return true
            } else {
                debug('placeOrder => body ==>', resBody)
                this.log(`Order Failed. Resson: ${JSON.parse(resBody)?.errors[0]?.message || 'Unknown'}`, this.colors.red)
            }

        } catch (err) {
            debug(err)
            this.log(`Order Failed...`, this.colors.red)
        }
        return false
    }

    async confirmOrder(): Promise<boolean> {
        try {
            this.log('Confirming Order...')
            const res = await this.request(confirmUrl, confirmOptions(this.accessToken, this.orderID));
            const body = JSON.parse(res.body);
            if (body.isOrderUpdated) {
                this.log(`Order Confirmed!`, this.colors.green)
                return true
            } else {
                debug('confirmOrder => body ==>', body)
                this.log(`Order Confirmation Failed...`, this.colors.red)
            }
            return true
        } catch (err) {
            debug(err)
            this.log(`Order Confirmation Failed...`, this.colors.red)
        }
        return false

    }



    async main(): Promise<void> {
        const sleep = (ms: number) => new Promise(x => setTimeout(x, ms));
        let Case = 'basicAuth';
        while (true) {
            if (Case != 'basicAuth') await sleep(1000)
            let shouldStop = false;
            debug('Case ==>', Case)
            switch (Case) {
                case 'basicAuth': {
                    if (!this.basicAuth) {
                        if (!(await this.getPreData())) {
                            shouldStop = true;
                        } else {
                            Case = 'getAuthToken';
                        }
                    } else {
                        Case = 'getAuthToken';
                    }
                    break;
                };
                case 'getAuthToken': {
                    if (await this.getAuthToken()) {
                        Case = 'getAddressInfo';
                    } else {
                        shouldStop = true;
                    }
                    break;
                }
                case 'getAddressInfo': {
                    if (this.extraAddress) {
                        Case = 'placeOrder';
                    } else {
                        if (await this.getAddressInfo()) {
                            Case = 'placeOrder';
                        } else {
                            shouldStop = true;
                        }
                    }
                    break;
                }
                case 'placeOrder': {
                    if (await this.placeOrder()) {
                        Case = 'confirmOrder';
                    } else {
                        shouldStop = true;
                    }
                }
                case 'confirmOrder': {
                    await sleep(4000)
                    if (await this.confirmOrder()) {
                        Case = 'success';
                    } else {
                        Case = 'failed';
                    }
                    break;
                }

                case 'success': {
                    if (this.webhook.UseHook && this.webhook.url?.length > 1) {
                        await sendHook(this.webhook.url, this.orderData)
                    }
                    this.log('Task Successful!', this.colors.green)
                    shouldStop = true;
                    break
                }

                case 'failed': {
                    this.log('Task Failed...', this.colors.red)
                    shouldStop = true;
                    break
                }

                default: {
                    debug('Sent Default Case ==>', Case)
                    shouldStop = true;
                    break;
                }
            }

            if (shouldStop) break;
        }
        return;
    }

    async checkOrder(orderID: string, lastName: string): Promise<string> {
        this.log(`Getting Order Status...`)
        try {
            const res = await this.request('https://www.t-mobile.com/self-service-shop/v1/orders/searchOrders', checkOrderOptions(this.checkAuth, {
                orderId: orderID,
                zip: this.profile.zipCode,
                lastName: lastName
            }));
            const body = JSON.parse(res.body);
            let order = body.orders[0];
            let time = new Date(order.creationTime)
            let status = order.status;
            this.log(`Status: ${status} | Time: ${time.toLocaleString()} | IP:${order.salesInfo.ipAddress}|email:${order.customerProfile.emailCommunications[0].emailAddress}`, this.colors.green)
            return status
        } catch (err) {
            if (err.response) {
                // debug(err.response.statusCode, err.response.body)
                this.log(`[${err.response.statusCode}] Failed...`, this.colors.red)
            } else {
                debug(err)
                this.log(`[None] Failed...`, this.colors.red)
            }
            if (this.proxy) this.proxy.change();
            return
        }
    }

    async getCheckAuth(): Promise<boolean> {
        try {
            const res = await this.request('https://www.t-mobile.com/self-service-shop/v1/oauth', checkOrderAuthOptions());
            const body = JSON.parse(res.body);
            this.checkAuth = body.accessToken
            return typeof this.checkAuth === 'string' && this.checkAuth.length > 1;
        } catch (err) {
            if (this.proxy) this.proxy.change();
            //    / debug(err)
        }
        return false
    }

    async retry() {
        for (let x = 0; x < 5; x++) {
            if (await this.getCheckAuth()) {
                return true
            }
        }
        return false
    }

    async check() {
        const orders = getOrders()
        for (let order of orders) {
            let [OrderID, lastName, other] = order.split(':')
            if (OrderID && lastName) {
                super._task_id = `OrderID:${OrderID}`
                this._task_id = `OrderID:${OrderID}`
                this.log(`Checking Order`)
                if (await this.retry()) {
                    let status = await this.checkOrder(OrderID, lastName)
                    if (status === 'FAILED') {
                        this.log(`Order Failed Removing Order`, this.colors.red)
                        removeOrder(order)
                    } else if (status === 'COMPLETED') {
                        this.log(`Order Completed!`, this.colors.green)
                    } else if (status === 'RUNNING') {
                        this.log(`RUNNING`, this.colors.yellow)
                    }
                } else {
                    this.log('Failed', this.colors.red)
                }
            }
        }
        return;
    }
}