export type Lancamento = {
    valor: number;
    categoria: string;
    data: string;
    tipo: 'entrada' | 'saida';
};
