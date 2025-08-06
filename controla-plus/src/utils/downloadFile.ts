import { Telegraf } from 'telegraf';

export async function getBuffer(bot: Telegraf, fileId: string): Promise<Buffer> {
    const link = await bot.telegram.getFileLink(fileId);
    const response = await fetch(link.href);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
}
