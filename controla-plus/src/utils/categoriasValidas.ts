export const categoriasValidas = [
    // Entradas
    'salário',
    'freela',
    'pix',
    'investimento',
    'outros',

    // Saídas
    'mercado',
    'aluguel',
    'transporte',
    'lazer',
    'lanche',
    'contas',
    'outros'
];

export function categoriaEhValida(categoria: string): boolean {
    const categoriaFormatada = categoria.trim().toLowerCase();
    return categoriasValidas.includes(categoriaFormatada);
}

export function listarCategorias(): string {
    return categoriasValidas.map((cat) => `• ${cat}`).join('\n');
}
