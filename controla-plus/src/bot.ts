import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

import { setupEntradaCommand } from './commands/entrada';
import { setupSaidaCommand } from './commands/saida';
import { setupSaldoCommand } from './commands/saldo';
import { setupHistoricoCommand } from './commands/historico';
import { setupCategoriasCommand } from './commands/categorias';
import { setupRelatoriosCommand } from './commands/relatorios';
import { setupAjudaCommand } from './commands/ajuda';
import { setupTendenciaCommand } from './commands/tendencia';
import { setupEconomiaCommand } from './commands/economia';
import { setupPrevisaoCommand } from './commands/previsao';
import { setupFixasCommand } from './commands/fixas';
import { setupImportarCommand } from './commands/importar';

import { iniciarAgendador } from './utils/agendador';
import { iniciarAgendadorRelatorio } from './utils/agendadorRelatorio';

import { mensagemBoasVindas } from './mensagens';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Comandos
setupEntradaCommand(bot);
setupSaidaCommand(bot);
setupSaldoCommand(bot);
setupHistoricoCommand(bot);
setupCategoriasCommand(bot);
setupRelatoriosCommand(bot);
setupAjudaCommand(bot);
setupTendenciaCommand(bot);
setupEconomiaCommand(bot);
setupPrevisaoCommand(bot);
setupFixasCommand(bot);
setupImportarCommand(bot);

// Automatização
iniciarAgendador(bot);
iniciarAgendadorRelatorio(bot);

bot.start((ctx) => {
    const nome = ctx.from?.first_name || 'usuário';
    ctx.replyWithMarkdownV2(mensagemBoasVindas(nome));
})

bot.launch();
console.log('🤖 Bot financeiro rodando...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));