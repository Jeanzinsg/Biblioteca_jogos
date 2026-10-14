# Steam RPG

Você informa um perfil da Steam e o sistema gera uma ficha de RPG a partir da biblioteca:
classe, nível, atributos, relíquias e títulos. Depois dá para comparar a sua ficha com a dos amigos.

Projeto de Programação Orientada a Objetos (Senac), em TypeScript, com interface de terminal.

## Como rodar

```bash
npm install
cp .env.example .env   # e cole a sua chave em STEAM_API_KEY
npm start
```

Outros comandos:

- `npm test`: roda os testes
- `npm run typecheck`: confere os tipos

A chave da API é gerada em https://steamcommunity.com/dev/apikey. O `.env` nunca vai para o Git.
Para o sistema ler o perfil, os detalhes de jogos precisam estar públicos na Steam.

## Estrutura

```
src/
  contratos.ts    tipos combinados entre todo mundo (não mexa sozinho)
  steam/          Jean: SteamService, cache e erros da API
  dominio/        Ribeiro: Personagem, classes, relíquias e títulos
  regras/         Veio: CalculadoraDeAtributos e balanceamento
  cli/            Nebacetin: menus e telas
  dados-falsos/   perfilFalso.ts, usado por todos até a integração
  main.ts
```

## Regras de Git

1. Cada um trabalha na própria branch: `jean/steam`, `ribeiro/dominio`, `veio/regras`, `nebacetin/cli`.
2. Mexa só na sua pasta. Precisou mudar `contratos.ts`? Avise no grupo primeiro.
3. Commits pequenos, com mensagem que diz o que mudou (ex.: `feat: calcula nivel por horas totais`).
4. Junte no `main` por Pull Request, com alguém do grupo revisando antes do merge.
5. Nunca use `git push --force` e nunca suba o `.env`.

O projeto antigo (biblioteca de jogos) está guardado na branch `arquivo/biblioteca-antiga`.
