import { Lancamento } from '../types/lancamento';

export const saldos: Record<number, number> = {};
export const historicos: Record<number, Lancamento[]> = {};

export function registrarLancamento(
    userId: number,
    tipo: 'entrada' | 'saida',
    valor: number,
    categoria: string
): Lancamento {
    if (!saldos[userId]) saldos[userId] = 0;
    if (!historicos[userId]) historicos[userId] = [];

    const data = new Date().toISOString();
    const lancamento: Lancamento = {
        valor,
        categoria,
        data,
        tipo
    };

    historicos[userId].push(lancamento);
    saldos[userId] += tipo === 'entrada' ? valor : -valor;

    return lancamento;
}

export function getSaldo(userId: number): number {
    return saldos[userId] || 0;
}

export function getHistorico(userId: number): Lancamento[] {
    return historicos[userId] || [];
}

export function getUsuariosComHistorico(): number[] {
    return Object.keys(historicos).map((id) => parseInt(id));
}