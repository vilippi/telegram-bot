import { getMeta } from '../storage/economia';
import { getHistorico } from '../storage/dados';

export function verificarSeBateuMeta(userId: number): string | null {
    const meta = getMeta(userId);
    if (!meta) return null;

    const historico = getHistorico(userId);
    const hoje = new Date();
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

    let totalEntradas = 0;
    let totalSaidas = 0;

    for (const item of historico) {
        const data = new Date(item.data);
        const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;

        if (chave === mesAtual) {
            if (item.tipo === 'entrada') totalEntradas += item.valor;
            else totalSaidas += item.valor;
        }
    }

    const economiaAtual = totalEntradas - totalSaidas;
    if (economiaAtual >= meta) {
        return `🎉 Parabéns! Você atingiu sua meta de economia de R$ ${meta.toFixed(2)} este mês! 💰`;
    }

    return null;
}
