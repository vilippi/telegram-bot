import { Telegraf } from 'telegraf';
import { registrarLancamento, getSaldo } from '../storage/dados';
import { categoriaEhValida, listarCategorias } from '../utils/categoriasValidas';
import { verificarSeBateuMeta } from '../utils/verificaMeta';

export function setupEntradaCommand(bot: Telegraf) {
    bot.command('entrada', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const partes = ctx.message.text.split(' ');
        const valor = parseFloat(partes[1]);
        if (isNaN(valor)) return ctx.reply("❗ Use: /entrada [valor] [categoria]");

        const categoria = partes.slice(2).join(' ').trim().toLowerCase();
        if (!categoriaEhValida(categoria)) {
            return ctx.reply(`❗ Categoria inválida: "${categoria}"\n\n📋 Categorias válidas:\n${listarCategorias()}`);
        }

        const lancamento = registrarLancamento(userId, 'entrada', valor, categoria);
        const saldo = getSaldo(userId);

        ctx.reply(`✅ Entrada registrada:
    • 💰 Valor: R$ ${valor.toFixed(2)}
    • 🏷️ Categoria: ${categoria}
    • 📆 ${new Date(lancamento.data).toLocaleString('pt-BR')}
    • 💼 Saldo atual: R$ ${saldo.toFixed(2)}`);
        const msgMeta = verificarSeBateuMeta(userId);
        if (msgMeta) ctx.reply(msgMeta);
    });
}
