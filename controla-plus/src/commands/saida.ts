import { Telegraf } from 'telegraf';
import { registrarLancamento, getSaldo } from '../storage/dados';

export function setupSaidaCommand(bot: Telegraf) {
    bot.command('saida', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const partes = ctx.message.text.split(' ');
        const valor = parseFloat(partes[1]);

        if (isNaN(valor)) {
            return ctx.reply("❗ Use: /saida [valor] [categoria]");
        }

        const categoria = partes.slice(2).join(' ') || 'sem-categoria';
        const lancamento = registrarLancamento(userId, 'saida', valor, categoria);
        const saldo = getSaldo(userId);

        ctx.reply(`❌ Saída registrada:
    • 💸 Valor: R$ ${valor.toFixed(2)}
    • 🏷️ Categoria: ${categoria}
    • 📆 ${new Date(lancamento.data).toLocaleString('pt-BR')}
    • 💼 Saldo atual: R$ ${saldo.toFixed(2)}`);
    });
}
