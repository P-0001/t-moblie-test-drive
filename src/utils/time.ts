export const baseTemplate = "{m}-{d}-{y} {h}:{i}:{s}.{ms} {zs}";
export const logTimeStampTemplate = "{h}:{i}:{s}.{ms}";
const logDateTemplate = "{m}-{d}-{y}";

function formatTimeZone(minutesOffset: number): string {
    var m = Math.abs(minutesOffset);
    return (minutesOffset >= 0 ? '-' : '+') +
        pad(Math.floor(m / 60)) + ':' +
        pad(m % 60);
};

export function pad(number: number, length = 2, padding = '0'): string {
    return `${number}`.padStart(length, padding);
}


export const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const upTime = () => `${getLocale()}-${timeZoneString}`
const getLocale = (date = new Date().toLocaleString().replace(',', '').split(' ')): string => `${date[0]};${date[1]}`;
export function formatDate(template = baseTemplate, date = new Date()): string {
    return template
        .replace('{y}', String(date.getFullYear()))
        .replace('{m}', pad(date.getMonth() + 1))
        .replace('{d}', pad(date.getDate()))
        .replace('{h}', pad(date.getHours()))
        .replace('{i}', pad(date.getMinutes()))
        .replace('{s}', pad(date.getSeconds()))
        .replace('{ms}', pad(date.getMilliseconds(), 3))
        .replace('{zs}', timeZoneString)
        .replace('{LT}', date.toLocaleTimeString().split(' ')[0])
        .replace('{zd}', formatTimeZone(date.getTimezoneOffset()))
        .replace('{iso}', date.toISOString())
        .replace('{MN}', date.getHours() >= 12 ? 'PM' : 'AM');
};

export const logDate = formatDate(logDateTemplate)