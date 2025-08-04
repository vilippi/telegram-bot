import { Telegraf } from 'telegraf';
import { getHistorico } from '../storage/dados';
import { definirMeta, getMeta } from '../storage/economia';

function getMesAnoAtual(): string {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

export function setupEconomiaCommand(bot: Telegraf) {
    bot.command('economia', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const partes = ctx.message.text.split(' ');
        const temValor = partes.length > 1;
        let meta: number;

        if (temValor) {
            const valor = parseFloat(partes[1]);
            if (isNaN(valor)) {
                return ctx.reply("❗ Use: /economia [meta]\nExemplo: /economia 1000");
            }
            definirMeta(userId, valor);
            meta = valor;
        } else {
            const metaSalva = getMeta(userId);
            if (!metaSalva) {
                return ctx.reply("⚠️ Você ainda não definiu uma meta de economia. Use:\n/economia [valor]");
            }
            meta = metaSalva;
        }

        const historico = getHistorico(userId);
        const mesAtual = getMesAnoAtual();

        let totalEntradas = 0;
        let totalSaidas = 0;

        for (const item of historico) {
            const itemData = new Date(item.data);
            const chave = `${itemData.getFullYear()}-${String(itemData.getMonth() + 1).padStart(2, '0')}`;
            if (chave === mesAtual) {
                if (item.tipo === 'entrada') totalEntradas += item.valor;
                else totalSaidas += item.valor;
            }
        }

        const economiaAtual = totalEntradas - totalSaidas;
        const diferenca = meta - economiaAtual;
        const atingiuMeta = economiaAtual >= meta;

        ctx.reply(
            `🎯 Meta de economia: R$ ${meta.toFixed(2)}\n\n` +
            `📥 Entradas no mês: R$ ${totalEntradas.toFixed(2)}\n` +
            `📤 Saídas no mês: R$ ${totalSaidas.toFixed(2)}\n` +
            `💼 Economia atual: R$ ${economiaAtual.toFixed(2)}\n` +
            (atingiuMeta
                ? `✅ Você atingiu sua meta de economia este mês!`
                : `🚧 Faltam: R$ ${diferenca.toFixed(2)} para atingir sua meta`)
        );
    });
}
