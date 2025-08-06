import { Telegraf } from 'telegraf';
import { registrarLancamento, getSaldo, getHistorico } from '../storage/dados';
import { categoriaEhValida, listarCategorias } from '../utils/categoriasValidas';
import { verificarSeBateuMeta } from '../utils/verificaMeta';
import { getMetaPorCategoria } from '../storage/planejamento';

export function setupSaidaCommand(bot: Telegraf) {
    bot.command('saida', (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const partes = ctx.message.text.split(' ');
        const valor = parseFloat(partes[1]);
        if (isNaN(valor)) return ctx.reply("❗ Use: /saida [valor] [categoria]");

        const categoria = partes.slice(2).join(' ').trim().toLowerCase();
        if (!categoriaEhValida(categoria)) {
            return ctx.reply(`❗ Categoria inválida: "${categoria}"\n\n📋 Categorias válidas:\n${listarCategorias()}`);
        }

        const lancamento = registrarLancamento(userId, 'saida', valor, categoria);
        const saldo = getSaldo(userId);

        ctx.reply(`❌ Saída registrada:
    • 💸 Valor: R$ ${valor.toFixed(2)}
    • 🏷️ Categoria: ${categoria}
    • 📆 ${new Date(lancamento.data).toLocaleString('pt-BR')}
    • 💼 Saldo atual: R$ ${saldo.toFixed(2)}`).then(() => {
            // 🔔 Verificação de meta mensal (economia)
            const msgMeta = verificarSeBateuMeta(userId);
            if (msgMeta) ctx.reply(msgMeta);

            // 🔔 Verificação de planejamento por categoria
            const metaCategoria = getMetaPorCategoria(userId, categoria);
            if (metaCategoria) {
                // Total da categoria no mês atual
                const hoje = new Date();
                const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

                const historico = getHistorico(userId).filter((item) => {
                    const data = new Date(item.data);
                    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
                    return (
                        chave === mesAtual &&
                        item.tipo === 'saida' &&
                        item.categoria.toLowerCase() === categoria
                    );
                });

                const totalCategoria = historico.reduce((acc, item) => acc + item.valor, 0);

                if (totalCategoria >= metaCategoria) {
                ctx.reply(`🚨 Você ultrapassou a meta de *${categoria}* (R$ ${metaCategoria.toFixed(2)}). Total gasto: R$ ${totalCategoria.toFixed(2)}`);
                } else if (totalCategoria >= metaCategoria * 0.8) {
                ctx.reply(`⚠️ Atenção: você já gastou R$ ${totalCategoria.toFixed(2)} de R$ ${metaCategoria.toFixed(2)} na categoria *${categoria}*.`);
                }
            }
        });
    });
}
