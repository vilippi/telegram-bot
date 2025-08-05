type GastoFixo = {
    nome: string;
    valor: number;
};

const gastosFixos: Record<number, GastoFixo[]> = {}; // userId → lista de gastos fixos

export function adicionarGastoFixo(userId: number, nome: string, valor: number) {
    if (!gastosFixos[userId]) gastosFixos[userId] = [];
    gastosFixos[userId].push({ nome, valor });
}

export function removerGastoFixo(userId: number, nome: string) {
    if (!gastosFixos[userId]) return;
    gastosFixos[userId] = gastosFixos[userId].filter(g => g.nome.toLowerCase() !== nome.toLowerCase());
}

export function listarGastosFixos(userId: number): GastoFixo[] {
    return gastosFixos[userId] || [];
}
