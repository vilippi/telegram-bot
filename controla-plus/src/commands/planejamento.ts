import { Telegraf } from 'telegraf';
import { definirMetaPorCategoria, getTodasMetas } from '../storage/planejamento';

export function setupPlanejamentoCommand(bot: Telegraf) {
    bot.command('planejamento', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const partes = ctx.message.text.split(' ').slice(1);

        if (partes.length === 0) {
            const metas = getTodasMetas(userId);
            if (metas.length === 0) return ctx.reply("📭 Você ainda não tem metas de planejamento definidas.");

            const msg = metas.map(m => `• ${m.categoria}: R$ ${m.valor.toFixed(2)}`).join('\n');
            return ctx.reply(`📌 Suas metas atuais:\n\n${msg}`);
        }

        if (partes.length < 2) {
            return ctx.reply("❗ Use: /planejamento [categoria] [valor]\nEx: /planejamento mercado 1000");
        }

        const categoria = partes[0].toLowerCase();
        const valor = parseFloat(partes[1]);

        if (isNaN(valor)) {
            return ctx.reply("❗ Valor inválido. Use: /planejamento [categoria] [valor]");
        }

        definirMetaPorCategoria(userId, categoria, valor);
        ctx.reply(`✅ Meta para "${categoria}" definida: R$ ${valor.toFixed(2)}`);
    });
}
