import { Telegraf } from 'telegraf';
import { getHistorico } from '../storage/dados';

export function setupHistoricoCommand(bot: Telegraf) {
    bot.command('historico', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const historico = getHistorico(userId);

        if (historico.length === 0) {
            return ctx.reply("📭 Você ainda não registrou nenhuma entrada ou saída.");
        }

        const ultimos = historico.slice(-10).reverse(); // últimos 10 lançamentos

        const mensagem = ultimos.map((item) => {
            const dataFormatada = new Date(item.data).toLocaleString('pt-BR');
            const simbolo = item.tipo === 'entrada' ? '➕' : '➖';
            const cor = item.tipo === 'entrada' ? '💰' : '💸';

            return `${simbolo} ${cor} R$ ${item.valor.toFixed(2)} | ${item.categoria} | ${dataFormatada}`;
        }).join('\n');

        ctx.reply(`📜 Seus últimos lançamentos:\n\n${mensagem}`);
    });
}
