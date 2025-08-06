import { Telegraf } from 'telegraf';
import { getUsuariosComHistorico, getHistorico } from '../storage/dados';

function getMesAnterior(): string {
    const hoje = new Date();
    const anterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1);
    return `${anterior.getFullYear()}-${String(anterior.getMonth() + 1).padStart(2, '0')}`;
}

function formatarMesExtenso(data: Date): string {
    return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export function iniciarAgendadorRelatorio(bot: Telegraf) {
    setInterval(() => {
        const hoje = new Date();
        if (hoje.getDate() !== 1) return; // só roda no 1º dia do mês

        const usuarios = getUsuariosComHistorico();
        const mesAnteriorChave = getMesAnterior();
        const mesAnteriorNome = formatarMesExtenso(new Date(hoje.getFullYear(), hoje.getMonth() - 1));

        for (const userId of usuarios) {
            const historico = getHistorico(userId).filter((item) => {
                const data = new Date(item.data);
                const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
                return chave === mesAnteriorChave;
            });

            if (historico.length === 0) continue;

            let entradas = 0;
            let saidas = 0;
            const porCategoria: Record<string, number> = {};

            for (const item of historico) {
                if (item.tipo === 'entrada') entradas += item.valor;
                else saidas += item.valor;

                porCategoria[item.categoria] = (porCategoria[item.categoria] || 0) + item.valor;
            }

            const economia = entradas - saidas;

            let msg = `📆 Relatório de ${mesAnteriorNome}:\n\n`;
            msg += `➕ Entradas: R$ ${entradas.toFixed(2)}\n`;
            msg += `➖ Saídas: R$ ${saidas.toFixed(2)}\n`;
            msg += `💼 Economia: R$ ${economia.toFixed(2)}\n\n`;

            msg += `📊 Categorias mais usadas:\n`;
            const categoriasOrdenadas = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]);

            for (const [cat, total] of categoriasOrdenadas.slice(0, 5)) {
                msg += `• ${cat}: R$ ${total.toFixed(2)}\n`;
            }

            bot.telegram.sendMessage(userId, msg.trim());
        }
    }, 1000 * 60 * 60 * 12); // verifica a cada 12h
}
