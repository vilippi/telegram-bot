import { listarLembretesDoDia } from '../storage/lembretes';
import { Telegraf } from 'telegraf';

export function iniciarAgendador(bot: Telegraf) {
    setInterval(() => {
        const hoje = new Date();
        const diaHoje = hoje.getDate();

        bot.telegram.getMe().then(() => {
            // percorre os usuários (limitação: precisa manter ids ativos)
            const userIds = Object.keys(require('../storage/lembretes')).map(Number);

            for (const userId of userIds) {
                const lembretes = listarLembretesDoDia(userId, diaHoje);
                for (const lembrete of lembretes) {
                    bot.telegram.sendMessage(userId, `📅 Lembrete de hoje:\n${lembrete.mensagem}`);
                }
            }
        });
    }, 1000 * 60 * 60 * 6); // verifica a cada 6 horas (pode ajustar)
}
