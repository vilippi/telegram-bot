import { Telegraf } from 'telegraf';
import { getSaldo } from '../storage/dados';

export function setupSaldoCommand(bot: Telegraf) {
    bot.command('saldo', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const saldo = getSaldo(userId);

        ctx.reply(`📊 Seu saldo atual é: R$ ${saldo.toFixed(2)}`);
    });
}

