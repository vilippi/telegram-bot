import { Telegraf } from 'telegraf';
import { adicionarLembrete, listarTodosLembretes } from '../storage/lembretes';

export function setupLembreteCommand(bot: Telegraf) {
    bot.command('lembrete', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const partes = ctx.message.text.trim().split(' ').slice(1);

        if (partes.length === 0) {
            // Listar lembretes
            const todos = listarTodosLembretes(userId);
            if (todos.length === 0) return ctx.reply("📭 Você ainda não tem lembretes registrados.");

            const msg = todos
                .map((l) => `📅 Dia ${l.dia}: ${l.mensagem}`)
                .join('\n');

            return ctx.reply(`📝 Seus lembretes:\n\n${msg}`);
        }

        const dia = parseInt(partes[0]);
        const mensagem = partes.slice(1).join(' ');

        if (isNaN(dia) || dia < 1 || dia > 31 || !mensagem) {
            return ctx.reply("❗ Use: /lembrete [dia] [mensagem]\nEx: /lembrete 10 pagar aluguel");
        }

        adicionarLembrete(userId, dia, mensagem);
        ctx.reply(`✅ Lembrete criado!\n📅 Todo dia ${dia}: ${mensagem}`);
    });
}
