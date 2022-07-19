import { WebhookClient, EmbedBuilder } from 'discord.js';

function toObj(name: string, value: string) {
    return { name, value };
}

function buildHook(data: orderData): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`Order`)
        .setAuthor({ name: 'Emerald 💎', iconURL: 'https://media.discordapp.net/attachments/803071036622372864/839891221782593577/fgdjdgfjfdj.png', url: 'https://twitter.com/Emerald_AIO' })
        .setURL(`https://www.t-mobile.com/offers/free-trial`)
        .addFields([
            toObj('Email', data.email),
            toObj('First Name', data.firstName),
            toObj('Last Name', data.lastName),
            toObj('Order#', `||${data.orderId}||`),
            toObj('Proxy', data.proxy === 'Local' ? 'Local' : `||${data.proxy}||`),
            toObj('Data', `||${data.data || 'N/A'}||`)
        ])
        .setColor('#e20074')
        .setThumbnail('https://is3-ssl.mzstatic.com/image/thumb/Purple116/v4/df/40/a1/df40a1c5-b058-d896-e8a3-a86cca889765/source/512x512bb.jpg')
        .setFooter({ text: 'P~#1989', iconURL: 'https://media.discordapp.net/attachments/803071036622372864/839891221782593577/fgdjdgfjfdj.png' })
        .setTimestamp();
}

export async function sendHook(url: string, account: orderData) {
    const webhook = new WebhookClient({ url });
    return webhook.send({
        username: 'Emerald-P~#1989',
        avatarURL: 'https://media.discordapp.net/attachments/803071036622372864/839891221782593577/fgdjdgfjfdj.png',
        embeds: [buildHook(account)],
    });
};