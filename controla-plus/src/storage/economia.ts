const metasMensais: Record<number, number> = {}; // userId → meta

export function definirMeta(userId: number, valor: number) {
    metasMensais[userId] = valor;
}

export function getMeta(userId: number): number | null {
    return metasMensais[userId] || null;
}
