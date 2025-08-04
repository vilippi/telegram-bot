export function mensagemBoasVindas(nome: string): string {
  return `👋 Olá *${nome}*, sou seu bot financeiro\\!

Aqui estão os comandos que você pode usar:

📥 */entrada* \`valor\` \`categoria\`  
\\- Registrar uma entrada  
_Exemplo:_ \`/entrada 2000 salário\`

📤 */saida* \`valor\` \`categoria\`  
\\- Registrar uma saída  
_Exemplo:_ \`/saida 150 mercado\`

💰 */saldo*  
\\- Ver seu saldo atual

📊 */historico*  
\\- Ver todas as suas transações

🧹 */limpar*  
\\- Limpar todas as transações

*/ajuda*  
\\- Mostra todos os comandos

Digite qualquer um desses comandos para começar\\!`;
}