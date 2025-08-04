import { Telegraf } from 'telegraf';
import { getHistorico } from '../storage/dados';

export function setupCategoriasCommand(bot: Telegraf) {
    bot.command('categorias', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const historico = getHistorico(userId);
        if (historico.length === 0) {
            return ctx.reply("📭 Você ainda não tem lançamentos para exibir.");
        }

        const partes = ctx.message.text.split(' ');
        const categoriaBuscada = partes.slice(1).join(' ').toLowerCase();

        if (categoriaBuscada) {
            // Filtrar por categoria
            const filtrado = historico.filter(item => item.categoria.toLowerCase() === categoriaBuscada);

            if (filtrado.length === 0) {
                return ctx.reply(`❌ Nenhuma movimentação encontrada para a categoria *${categoriaBuscada}*.`);
            }

            let mensagem = `📂 Movimentações da categoria *${categoriaBuscada}*:\n\n`;

            for (const item of filtrado) {
                const valor = item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                const tipo = item.tipo === 'entrada' ? '➕ Entrada' : '➖ Saída';
                const data = item.data ? ` em ${item.data}` : ''; // opcional
                mensagem += `${tipo}: ${valor}${data}\n`;
            }

            return ctx.reply(mensagem.trim(), { parse_mode: 'Markdown' });
        }

        // Caso não tenha passado categoria → resumo geral
        const entradas: Record<string, number> = {};
        const saidas: Record<string, number> = {};

        for (const item of historico) {
            const mapa = item.tipo === 'entrada' ? entradas : saidas;
            mapa[item.categoria] = (mapa[item.categoria] || 0) + item.valor;
        }

        let mensagem = "📊 Resumo por categoria:\n\n";

        if (Object.keys(entradas).length > 0) {
            mensagem += "➕ Entradas:\n";
            for (const [cat, total] of Object.entries(entradas)) {
                mensagem += `• ${cat}: R$ ${total.toFixed(2)}\n`;
            }
            mensagem += "\n";
        }

        if (Object.keys(saidas).length > 0) {
            mensagem += "➖ Saídas:\n";
            for (const [cat, total] of Object.entries(saidas)) {
                mensagem += `• ${cat}: R$ ${total.toFixed(2)}\n`;
            }
        }

        ctx.reply(mensagem.trim());
    });
}