import { Telegraf } from 'telegraf';
import { getHistorico, getSaldo } from '../storage/dados';

export function setupRelatoriosCommand(bot: Telegraf) {
    bot.command('relatorios', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const historico = getHistorico(userId);
        const saldo = getSaldo(userId);

        if (historico.length === 0) {
            return ctx.reply("📭 Nenhum lançamento encontrado para gerar relatório.");
        }

        const entradas: Record<string, number> = {};
        const saidas: Record<string, number> = {};
        let totalEntradas = 0;
        let totalSaidas = 0;

        for (const item of historico) {
            const mapa = item.tipo === 'entrada' ? entradas : saidas;
            mapa[item.categoria] = (mapa[item.categoria] || 0) + item.valor;

            if (item.tipo === 'entrada') totalEntradas += item.valor;
            else totalSaidas += item.valor;
        }

        let mensagem = "📊 Relatório geral:\n\n";

        if (Object.keys(entradas).length > 0) {
            mensagem += "➕ Entradas:\n";
            for (const [cat, total] of Object.entries(entradas)) {
                mensagem += `• ${cat}: R$ ${total.toFixed(2)}\n`;
            }
            mensagem += `Total entradas: R$ ${totalEntradas.toFixed(2)}\n\n`;
        }

        if (Object.keys(saidas).length > 0) {
            mensagem += "➖ Saídas:\n";
            for (const [cat, total] of Object.entries(saidas)) {
                mensagem += `• ${cat}: R$ ${total.toFixed(2)}\n`;
            }
            mensagem += `Total saídas: R$ ${totalSaidas.toFixed(2)}\n\n`;
        }

        mensagem += `💼 Saldo final: R$ ${saldo.toFixed(2)}`;

        ctx.reply(mensagem.trim());
    });
}
