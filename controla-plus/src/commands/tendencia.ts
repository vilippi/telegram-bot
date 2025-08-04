import { Telegraf } from 'telegraf';
import { getHistorico } from '../storage/dados';

function formatarMesAno(dataISO: string) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export function setupTendenciaCommand(bot: Telegraf) {
    bot.command('tendencia', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const historico = getHistorico(userId).filter(h => h.tipo === 'saida');
        if (historico.length === 0) {
            return ctx.reply("📭 Nenhuma saída registrada para analisar tendência.");
        }

        const porMes: Record<string, number> = {};

        for (const item of historico) {
            const data = new Date(item.data);
            const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`; // ex: 2025-08
            porMes[chave] = (porMes[chave] || 0) + item.valor;
        }

        const mesesOrdenados = Object.keys(porMes).sort(); // ordena cronologicamente
        let mensagem = "📈 Tendência de gastos:\n\n";

        let total = 0;
        let anterior = 0;

        for (const chave of mesesOrdenados) {
            const [ano, mes] = chave.split("-");
            const valor = porMes[chave];
            const data = new Date(Number(ano), Number(mes) - 1);
            const nomeMes = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

            const simbolo = anterior === 0 ? "" : valor > anterior ? "↑" : valor < anterior ? "↓" : "→";

            mensagem += `• ${nomeMes}: R$ ${valor.toFixed(2)} ${simbolo}\n`;
            anterior = valor;
            total += valor;
        }

        const media = total / mesesOrdenados.length;
        mensagem += `\n📊 Média: R$ ${media.toFixed(2)}`;

        ctx.reply(mensagem.trim());
    });
}
