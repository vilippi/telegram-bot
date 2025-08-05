import { Telegraf } from 'telegraf';
import { getHistorico } from '../storage/dados';
import { listarGastosFixos } from '../storage/gastosFixos';

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

        const fixos = listarGastosFixos(userId);
        const totalFixos = fixos.reduce((acc, item) => acc + item.valor, 0);

        const historico = getHistorico(userId).filter(h => h.tipo === 'saida');

        if (historico.length === 0 && totalFixos === 0) {
            return ctx.reply("📭 Você ainda não tem gastos suficientes para gerar uma previsão.");
        }

        // Agrupar variáveis por mês (excluindo fixos)
        const nomesFixos = fixos.map(f => f.nome.toLowerCase());
        const variaveisPorMes: Record<string, number> = {};

        for (const item of historico) {
            const nomeCategoria = item.categoria.toLowerCase();
            if (nomesFixos.includes(nomeCategoria)) continue; // pular se for fixo

            const data = new Date(item.data);
            const chave = getMesAno(data);
            variaveisPorMes[chave] = (variaveisPorMes[chave] || 0) + item.valor;
        }

        const mesesVariaveis = Object.keys(variaveisPorMes).sort().slice(-3); // últimos 3 meses
        const totalVariavel = mesesVariaveis.reduce((acc, chave) => acc + variaveisPorMes[chave], 0);
        const mediaVariavel = mesesVariaveis.length > 0 ? totalVariavel / mesesVariaveis.length : 0;

        const mesAtual = formatarMesAno(new Date());
        const previsao = totalFixos + mediaVariavel;

        const mensagem = `📊 Previsão de gastos para ${mesAtual}:\n\n` +
            `• Gastos fixos: R$ ${totalFixos.toFixed(2)}\n` +
            `• Médias variáveis (últimos ${mesesVariaveis.length} meses): R$ ${mediaVariavel.toFixed(2)}\n\n` +
            `🧮 Previsão total: R$ ${previsao.toFixed(2)}`;

        ctx.reply(mensagem.trim());
    });
}