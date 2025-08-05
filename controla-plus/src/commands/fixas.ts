import { Telegraf } from 'telegraf';
import {
    adicionarGastoFixo,
    removerGastoFixo,
    listarGastosFixos
} from '../storage/gastosFixos';

export function setupFixasCommand(bot: Telegraf) {
    bot.command('fixas', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const texto = ctx.message.text.trim();
        const partes = texto.split(' ').slice(1);

        if (partes.length === 0) {
            // Lista os fixos
            const fixos = listarGastosFixos(userId);
            if (fixos.length === 0) {
                return ctx.reply("📭 Você ainda não tem gastos fixos registrados.");
            }

            let msg = "📌 Seus gastos fixos:\n\n";
            let total = 0;
            for (const gasto of fixos) {
                msg += `• ${gasto.nome}: R$ ${gasto.valor.toFixed(2)}\n`;
                total += gasto.valor;
            }
            msg += `\n💰 Total fixos: R$ ${total.toFixed(2)}`;

            return ctx.reply(msg.trim());
        }

        const subcomando = partes[0].toLowerCase();

        if (subcomando === 'add') {
            const valor = parseFloat(partes[1]);
            const nome = partes.slice(2).join(' ');

            if (isNaN(valor) || !nome) {
                return ctx.reply("❗ Use: /fixas add [valor] [nome]\nExemplo: /fixas add 1200 aluguel");
            }

            adicionarGastoFixo(userId, nome, valor);
            return ctx.reply(`✅ Gasto fixo adicionado:\n• ${nome}: R$ ${valor.toFixed(2)}`);
        }

        if (subcomando === 'del') {
            const nome = partes.slice(1).join(' ');
            if (!nome) return ctx.reply("❗ Use: /fixas del [nome]\nExemplo: /fixas del aluguel");

            removerGastoFixo(userId, nome);
            return ctx.reply(`🗑️ Gasto fixo "${nome}" removido com sucesso.`);
        }

        // Subcomando inválido
        return ctx.reply("❗ Comando inválido.\nUse:\n• /fixas add [valor] [nome]\n• /fixas del [nome]\n• /fixas");
    });
}
