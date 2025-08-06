import { Telegraf } from 'telegraf';
import { getBuffer } from '../utils/downloadFile';
import { parseCSV, parseXLSX } from '../utils/parsers';
import { registrarLancamento } from '../storage/dados';

export function setupImportarCommand(bot: Telegraf) {
    bot.command('importar', (ctx) => {
        ctx.reply("📎 Envie agora o arquivo `.csv` ou `.xlsx` com seus lançamentos.");
    });

    bot.on('document', async (ctx) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const file = ctx.message.document;
        const fileName = file.file_name || '';
        const extension = fileName.split('.').pop()?.toLowerCase();

        if (!['csv', 'xlsx'].includes(extension || '')) {
            return ctx.reply("❗ Formato inválido. Envie um arquivo `.csv` ou `.xlsx` com as colunas: tipo, valor, categoria, data.");
        }

        const buffer = await getBuffer(bot, file.file_id);
        let dados: any[] = [];

        try {
            dados = extension === 'csv' ? await parseCSV(buffer) : parseXLSX(buffer);
        } catch (e) {
            return ctx.reply("❌ Erro ao processar o arquivo.");
        }

        let sucesso = 0;
        let erro = 0;

        for (const linha of dados) {
            try {
                const tipo = linha.tipo?.toLowerCase();
                const valor = parseFloat(linha.valor);
                const categoria = linha.categoria?.toLowerCase();
                const data = new Date(linha.data);

                if (!['entrada', 'saida'].includes(tipo) || isNaN(valor) || !categoria || isNaN(data.getTime())) {
                    throw new Error("Linha inválida");
                }

                registrarLancamento(userId, tipo, valor, categoria, data.toISOString());
                sucesso++;
            } catch {
                erro++;
            }
        }

        ctx.reply(`✅ Importação concluída.\n• Sucesso: ${sucesso}\n• Erros: ${erro}`);
    });
}
