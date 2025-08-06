# 💸 Controla Plus - Bot Financeiro para Telegram

Um bot simples, funcional e **100% gratuito** criado com **Node.js + TypeScript**, que permite **gerenciar suas finanças pessoais direto no Telegram**. Registre entradas e saídas, consulte saldo e histórico — **de forma privada, separada por usuário e sem depender de planilhas.**

---

## 📦 Funcionalidades

| Comando                          | Descrição                                                                 |
|----------------------------------|---------------------------------------------------------------------------|
| `/entrada 100 comida`            | Registra uma **entrada** de R$100 com categoria `comida`                  |
| `/saida 50 transporte`           | Registra uma **saída** de R$50 com categoria `transporte`                |
| `/saldo`                         | Exibe o **saldo atual** (entradas - saídas)                              |
| `/historico`                     | Mostra o **histórico completo** das transações do usuário                |
| `/categorias` ou `/categorias x` | Lista todas as categorias usadas ou filtra lançamentos por categoria     |
| `/relatorios`                    | Gera um resumo de entradas e saídas por categoria                        |
| `/importar`                      | Permite importar transações via arquivo `.csv` ou `.xlsx`                |
| `/tendencia`                     | Exibe uma análise de **tendências** com base nos últimos meses           |
| `/previsao`                      | Gera uma **previsão de saldo futuro** com base em entradas e saídas fixas |
| `/planejamento`                  | Permite definir **metas de economia** ou **limites de gasto por categoria** |
| `/lembrete`                      | Agenda um **lembrete financeiro**, como vencimento de conta ou fatura    |
| `/fixas`                         | Registra **gastos fixos**                                                |

> ✅ **Carteiras isoladas:** Cada usuário tem sua própria base de dados  
> 📊 **Relatórios organizados por categoria**  
> 📥 **Importação de planilhas facilitada** 

---

## 🚀 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Telegraf](https://telegraf.js.org/) — Framework para bots Telegram
- [xlsx](https://www.npmjs.com/package/xlsx) e [csv-parse](https://www.npmjs.com/package/csv-parse)

---

## 👾 Como usar? 

- https://t.me/ControlaPlusBot

---

## 🛠️ Instalação local

```bash
# Clone o repositório
git clone https://github.com/vilippi/telegram-bot.git
cd controla-plus

# Instale as dependências
npm install

# Crie um arquivo .env com o token do seu bot
echo "BOT_TOKEN=seu_token_aqui" > .env

# Rode o bot
npm run dev
