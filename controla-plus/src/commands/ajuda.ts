import { Telegraf } from 'telegraf';

export function setupAjudaCommand(bot: Telegraf) {
    bot.command('ajuda', (ctx) => {
        const mensagem = `
    📌 *Ajuda – Comandos disponíveis*:

    💸 *Lançamentos*:
    • /entrada [valor] [categoria] – Registra uma entrada
    • /saida [valor] [categoria] – Registra uma saída

    📊 *Consultas*:
    • /saldo – Mostra seu saldo atual
    • /historico – Lista os últimos 10 lançamentos
    • /relatorios – Mostra relatório por categoria e saldo final
    • /categorias – Mostra as categorias válidas

    ℹ️ *Outros*:
    • /ajuda – Mostra esta mensagem

    📝 *Exemplo de uso*:
    /entrada 1000 salário
    /saida 120 mercado
        `;

        ctx.replyWithMarkdown(mensagem.trim());
    });
}
