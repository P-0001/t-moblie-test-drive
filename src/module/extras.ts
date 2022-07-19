import { randomUUID } from 'crypto'
import * as webcrypto from '@peculiar/webcrypto'
import { jigger } from 'utils/tools';
import { faker } from '@faker-js/faker'
import findSub from 'utils/jigs';
import { FingerprintGenerator } from 'fingerprint-generator';
import x64hash128 from './hashing'

export const dataUrl = 'https://www.t-mobile.com/etc/clientlibs/t-mobile/publish/app/main.js';
export const orderUrl = 'https://api.t-mobile.com/shop/test-drive/v1/eligibility-submitorder';
export const oAuthUrl = 'https://core.saas.api.t-mobile.com/oauth2/v4/tokens';
export const addressUrl = 'https://core.saas.api.t-mobile.com/common/v1/addresses';
export const confirmUrl = 'https://api.t-mobile.com/shop/test-drive/v1/order';

export const getOptions = () => {
    return {
        headers: {
            Referer: 'https://www.t-mobile.com/offers/free-trial',
            'User-Agent': getUA(),
        }
    };
}
export const checkOrderAuthUrl = 'https://www.t-mobile.com/self-service-shop/v1/oauth';

const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);

let set = new FingerprintGenerator({
    browsers: [
        { name: "firefox", minVersion: 80 },
        { name: "chrome", minVersion: 87 },
        { name: "safari", minVersion: 80 }
    ],
    devices: [
        "desktop"
    ],
    operatingSystems: [
        "windows"
    ]
});

const getUA = () => set.getFingerprint().headers['user-agent'];
const randomString = (count: number) => faker.random.alphaNumeric(count);
const jigLine1 = (line1: string) => jigger(findSub(line1))

export const postOptionsBearer = ({ accessToken, data, transactionId }: { transactionId: string; accessToken: string; data?: Data; }) => {
    let browser = set.getFingerprint()
    return {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            Authorization: `Bearer ${accessToken}`,
            Connection: 'keep-alive',
            'Content-Type': 'application/json',
            Origin: 'https://www.t-mobile.com',
            Referer: 'https://www.t-mobile.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'Sec-GPC': '1',
            'User-Agent': browser.headers['user-agent'],
            activityId: randomUUID(),
            applicationId: 'TMO',
            channelId: 'WEB',
            // cspell:disable-next-line
            clientId: 'TMNG',
            correlationId: randomUUID(),
            transactionId: transactionId,
            transactionType: 'ACTIVATION',
            usn: randomUUID(),
        },
        body: JSON.stringify({
            customerProfile: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: data?.domain?.length > 1 ? faker.internet.email(null, null, data.domain) : faker.internet.email(),
                languagePreference: 'en',
                contactNumber: faker.phone.number('##########'),
                // cspell:disable-next-line
                isByodFlow: false,
                // cspell:disable-next-line
                imei: /*faker.phone.imei() */ "",
                deviceFingerPrintId: x64hash128(JSON.stringify(browser.fingerprint)),
            },
            address: {
                addressLine1: jigLine1(data.address.address1),
                // cspell:disable-next-line
                addressline2: data.address?.address2?.length > 1 ? jigger(data.address.address2) : '',
                city: capitalize(data.address.city),
                state: data.address.stateCode.toUpperCase(),
                zipCode: data.address.zipCode,
                geoCode: data.address.geoCode,
                zipExtension: data.address.zipExtension,
                countryCode: 'USA'
            }
        })
    }
};

export const postOptionsBearerAddress = (accessToken: string, profile: Profile) => {
    return {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            Authorization: `Bearer ${accessToken}`,
            Connection: 'keep-alive',
            'Content-Type': 'application/json',
            Origin: 'https://www.t-mobile.com',
            Referer: 'https://www.t-mobile.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'Sec-GPC': '1',
            'User-Agent': getUA(),
        },
        // cspell:ignore addressline1,addressline2,cityname,statecode,postalcode
        body: JSON.stringify({
            "addressline1": profile.address1,
            "addressline2": "",
            "cityname": profile.city.toUpperCase(),
            "statecode": profile.stateCode.toUpperCase(),
            "postalcode": profile.zipCode
        })
    }
};

export const postOptionsBasic = (basic: string) => {
    return {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            Authorization: `Basic ${basic}`,
            Connection: 'keep-alive',
            'Content-Length': '0',
            Origin: 'https://www.t-mobile.com',
            Referer: 'https://www.t-mobile.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': getUA(),
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
        }
    }
};

export const confirmOptions = (accessToken: string, orderId: string) => {
    const randomId1 = randomUUID()
    const randomId2 = randomUUID()
    const randomId3 = randomUUID()
    const randomId4 = randomUUID()
    return {
        method: 'PUT',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            Authorization: `Bearer ${accessToken}`,
            Connection: 'keep-alive',
            'Content-Type': 'application/json',
            Origin: 'https://www.t-mobile.com',
            Referer: 'https://www.t-mobile.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'Sec-GPC': '1',
            'User-Agent': getUA(),
            activityId: randomId4,
            applicationId: 'TMO',
            channelId: 'WEB',
            // cspell:disable-next-line
            clientId: 'TMNG',
            correlationId: randomId1,
            transactionId: randomId2,
            transactionType: 'ACTIVATION',
            usn: randomId3
        },
        body: JSON.stringify({ orderId })
    };
};

interface CheckOrderOptions {
    zip: string,
    lastName: string,
    orderId: string
};


const genX = () => Buffer.from(JSON.stringify({
    "iv": Buffer.from(randomString(15)).toString('base64'),
    "value": randomString(64),
    "mac": faker.internet.mac('')
})).toString('base64')

export const checkOrderOptions = (accessToken: string, data: CheckOrderOptions) => {
    return {
        method: 'POST',
        headers: {
            authority: 'www.t-mobile.com',
            accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            'activity-id': randomUUID(),
            authorization: `Bearer ${accessToken}`,
            'baggage-id': 'channel: Desktop, os: Windows',
            'content-type': 'application/json',
            'interaction-id': randomUUID(),
            origin: 'https://www.t-mobile.com',
            'origin-application-id': 'TMO',
            referer: 'https://www.t-mobile.com/order-status',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'sec-gpc': '1',
            'service-transaction-id': randomUUID(),
            'session-id': randomUUID(),
            'user-agent': getUA(),
            'workflow-id': 'Activations',
            'x-xsrf-token': genX()
        },
        body: JSON.stringify({
            billingZipCode: data.zip,
            brand: 'SHOP',
            lastName: data.lastName,
            orderId: data.orderId,
        })

    }
};

export const checkOrderAuthOptions = async () => {
    return {
        method: 'POST',
        headers: {
            authority: 'www.t-mobile.com',
            accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            'activity-id': randomUUID(),
            'baggage-id': 'channel: Desktop, os: Windows',
            'content-type': 'application/json',
            'interaction-id': '',
            origin: 'https://www.t-mobile.com',
            'origin-application-id': 'TMO',
            referer: 'https://www.t-mobile.com/order-status/details',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'sec-gpc': '1',
            'service-transaction-id': randomUUID(),
            'session-id': randomUUID(),
            'user-agent': getUA(),
            'workflow-id': 'Activations',
            'x-xsrf-token': genX()
        },
        body: JSON.stringify({
            jwk: await generateKeys(),
        })
    }
};

async function generateKeys(): Promise<string> {
    const { subtle } = new webcrypto.Crypto();
    // from website
    const key = await subtle.generateKey(
        {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: 'SHA-256' }
        },
        false,
        ['sign', 'verify']
    )
    return JSON.stringify(await subtle.exportKey("jwk", key.publicKey));
}
