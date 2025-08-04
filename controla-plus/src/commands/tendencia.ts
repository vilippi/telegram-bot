import { Telegraf } from 'telegraf';
import { getHistorico } from '../storage/dados';

function getMesAno(dataISO: string): string {
    const d = new Date(dataISO);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatarMesAno(dataISO: string): string {
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
            const chave = getMesAno(item.data);
            porMes[chave] = (porMes[chave] || 0) + item.valor;
        }

        const mesesOrdenados = Object.keys(porMes).sort();
        let mensagem = "📈 Tendência de gastos:\n\n";

        let total = 0;
        let anterior: number | null = null;

        for (const chave of mesesOrdenados) {
            const [ano, mes] = chave.split("-");
            const valor = porMes[chave];
            const data = new Date(Number(ano), Number(mes) - 1);
            const nomeMes = formatarMesAno(data.toISOString());

            let variacao = '';
            if (anterior !== null) {
                const porcentagem = ((valor - anterior) / anterior) * 100;
                const simbolo = porcentagem > 0 ? '+' : porcentagem < 0 ? '-' : '';
                variacao = ` (${simbolo}${Math.abs(porcentagem).toFixed(2)}%)`;
            }

            mensagem += `• ${nomeMes}: R$ ${valor.toFixed(2)}${variacao}\n`;
            anterior = valor;
            total += valor;
        }

        const media = total / mesesOrdenados.length;
        mensagem += `\n📊 Média: R$ ${media.toFixed(2)}`;

        ctx.reply(mensagem.trim());
    });
}
