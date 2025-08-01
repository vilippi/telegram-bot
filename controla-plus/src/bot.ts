import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { setupEntradaCommand } from './commands/entrada';
import { setupSaidaCommand } from './commands/saida';
import { setupSaldoCommand } from './commands/saldo';
import { setupHistoricoCommand } from './commands/historico';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Comandos
setupEntradaCommand(bot);
setupSaidaCommand(bot);
setupSaldoCommand(bot);
setupHistoricoCommand(bot);

bot.start((ctx) => {
    ctx.reply(`👋 Olá ${ctx.from.first_name}, sou seu bot financeiro.`);
});

bot.launch();
console.log('🤖 Bot financeiro rodando...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));