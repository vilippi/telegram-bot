type Lembrete = {
    dia: number;
    mensagem: string;
};

const lembretes: Record<number, Lembrete[]> = {}; // userId → lista de lembretes

export function adicionarLembrete(userId: number, dia: number, mensagem: string) {
    if (!lembretes[userId]) lembretes[userId] = [];
    lembretes[userId].push({ dia, mensagem });
}

export function listarLembretesDoDia(userId: number, dia: number): Lembrete[] {
    return (lembretes[userId] || []).filter((l) => l.dia === dia);
}

export function listarTodosLembretes(userId: number): Lembrete[] {
    return lembretes[userId] || [];
}