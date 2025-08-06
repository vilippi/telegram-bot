type MetaPorCategoria = {
    categoria: string;
    valor: number;
};

const metas: Record<number, MetaPorCategoria[]> = {}; // userId → metas

export function definirMetaPorCategoria(userId: number, categoria: string, valor: number) {
    if (!metas[userId]) metas[userId] = [];

    const existente = metas[userId].find(m => m.categoria === categoria);
    if (existente) {
        existente.valor = valor;
    } else {
        metas[userId].push({ categoria, valor });
    }
}

export function getMetaPorCategoria(userId: number, categoria: string): number | null {
    const meta = metas[userId]?.find(m => m.categoria === categoria);
    return meta ? meta.valor : null;
}

export function getTodasMetas(userId: number): MetaPorCategoria[] {
    return metas[userId] || [];
}
