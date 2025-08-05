import { Telegraf } from 'telegraf';
import { getHistorico } from '../storage/dados';

function getMesAno(data: Date): string {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

function formatarMesAno(data: Date): string {
    return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export function setupPrevisaoCommand(bot: Telegraf) {
    bot.command('previsao', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const historico = getHistorico(userId).filter(h => h.tipo === 'saida');
        if (historico.length === 0) {
            return ctx.reply("📭 Você ainda não tem gastos suficientes para gerar previsão.");
        }

        // Agrupar saídas por mês
        const gastosPorMes: Record<string, number> = {};

        for (const item of historico) {
            const data = new Date(item.data);
            const chave = getMesAno(data);
            gastosPorMes[chave] = (gastosPorMes[chave] || 0) + item.valor;
        }

        const mesesOrdenados = Object.keys(gastosPorMes).sort().slice(-3); // últimos 3 meses

        if (mesesOrdenados.length === 0) {
            return ctx.reply("📭 Não há meses suficientes para calcular a previsão.");
        }

        let total = 0;
        let detalhes = "";

        for (const chave of mesesOrdenados) {
            const [ano, mes] = chave.split("-");
            const data = new Date(Number(ano), Number(mes) - 1);
            const nomeMes = formatarMesAno(data);
            const valor = gastosPorMes[chave];
            detalhes += `• ${nomeMes}: R$ ${valor.toFixed(2)}\n`;
            total += valor;
        }

        const media = total / mesesOrdenados.length;
        const hoje = new Date();
        const nomeMesAtual = formatarMesAno(hoje);

        const mensagem = `📊 Previsão de gastos para ${nomeMesAtual}:\n\n` +
            `🔎 Baseado na média dos últimos ${mesesOrdenados.length} meses:\n` +
            `${detalhes}\n` +
            `🧮 Previsão: R$ ${media.toFixed(2)}`;

        ctx.reply(mensagem.trim());
    });
}
