import { faker } from "@faker-js/faker";
import UserAgent from 'user-agents';
import { randomUUID } from "node:crypto"
// cspell:ignore hotmail

export function pad(q: number | string, len = 2, padding = '0'): string {
    return `${q}`.padStart(len, padding);
}

export function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randomIndex(indexMax = 5): number {
    return Math.floor(Math.random() * indexMax);
}

export function genTaskId(prefix?: string): string {
    if (prefix && prefix.length >= 1) {
        return `${prefix}-${randomUUID().split('-')[0]}`
    }

    return randomUUID().replace(/-/g, '');
}

function randomEndFixEmail(useS = false): string {
    if (useS) return Date.now().toString(36);
    let which = randomRange(1, 5)
    let num = randomRange(1, 5);
    switch (which) {
        case 1:
            return faker.finance.pin(num)
        case 2:
            return faker.random.word().toLowerCase().substring(0, num)
        case 3:
            return faker.random.alpha({ count: num })
        case 4:
            return faker.random.alphaNumeric(num)
        case 5:
            return faker.datatype.hexadecimal(num)
        default:
            return faker.random.locale().toLowerCase()
    }
}

export function randomBool(chance = 0.5): boolean {
    return Math.random() < chance;
}

export const mobileUaReg = {
    android: new RegExp(/Android/i),
    ios: new RegExp(/iPhone|iPad|iPod/i),
}

const toMatch = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /Windows Phone/i
];

export function randomMobileUA(match?: RegExp): string {
    let reg = match ? [match] : toMatch;
    const userAgent = new UserAgent([{ deviceCategory: 'mobile' }, (data) => {
        return reg.some((toMatchItem) => {
            return data.userAgent.match(toMatchItem);
        });
    }]);
    return userAgent.random().data.userAgent;
}

export function gmailJigger(raw: string): string {
    return `${raw.split('@')[0]}+${randomEndFixEmail(randomBool())}@gmail.com`;
}

function getRandomConfig(): JiggerConfig {
    return {
        letters: true,
        spaces: true,
        inFront: true,
        both: randomBool()
    };
}

const letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const genRandNum = () => number[Math.floor(Math.random() * number.length)];
const genRandLet = () => letter[Math.floor(Math.random() * number.length)];
export function jigger(address: string, config = getRandomConfig()): string {
    let { letters, spaces, inFront, both } = config;
    //let jig = "";
    let len = randomRange(1, 5);
    let index = Math.floor(Math.random());
    let getJig = () => {
        let jig = '';
        for (let i = index; i < len; i++) {
            const randomNumber = Math.floor(Math.random() * 3); // 0, 1 or 2
            if (randomNumber === 0) {
                jig += genRandNum();
            } else if (randomNumber === 1) {
                if (!letters) {
                    jig += genRandNum();
                } else {
                    jig += genRandLet();
                }
            } else if (randomNumber === 2) {
                if (!spaces) {
                    jig += genRandNum();
                } else {
                    jig += " ";
                }
            }
        }
        return jig;
    }

    let newAddress = "";
    if (both) {
        newAddress = getJig() + address + getJig();
    } else {
        if (inFront) {
            newAddress = getJig() + " " + address;
        } else {
            newAddress = address + " " + getJig();
        }
    }
    return newAddress;
}