# Steam RPG

Você informa um perfil da Steam e o sistema transforma a biblioteca de jogos em um personagem de RPG:
classe, nível, atributos, relíquias, títulos e até uma maldição. Depois dá para batalhar contra o personagem de um amigo.

Projeto de Programação Orientada a Objetos (Senac), em TypeScript, com interface de terminal.

## Como rodar

```bash
npm install
cp .env.example .env   # e cole a sua chave em STEAM_API_KEY
npm start
```

- Sem chave no `.env`, o programa roda em **modo de teste** com dois perfis falsos.
- Com chave, ele busca na Steam de verdade. Você pode digitar o Steam ID (17 números), o link do perfil
  (`https://steamcommunity.com/profiles/...` ou `https://steamcommunity.com/id/...`) ou só o nome da URL personalizada.
- O perfil e os **detalhes de jogos** precisam estar públicos na Steam. Para listar amigos, a lista de amigos também.

A chave é gerada em https://steamcommunity.com/dev/apikey. O `.env` nunca vai para o Git.

Outros comandos:

- `npm test`: roda os testes
- `npm run typecheck`: confere os tipos

## Regras do jogo

**Atributos**: as horas de cada gênero viram pontos com `10 × log2(1 + horas/10)`, até no máximo 100.
Começa rápido e vai desacelerando: 40h dão 23 pontos, 120h dão 37 e 300h dão 50.
Um jogo com vários gêneros divide as horas entre eles.

| Atributo | Gêneros |
|---|---|
| Força | Action |
| Agilidade | Racing, Sports |
| Inteligência | Strategy |
| Sabedoria | RPG, Simulation, Adventure |
| Carisma | Massively Multiplayer, Casual, Indie |
| Sorte | % de todas as conquistas feitas |

**Nível**: raiz quadrada das horas totais (mínimo 1).

**Classe**: o maior entre Força (Guerreiro), Inteligência (Mago) e Agilidade (Ladino). Se empatar, ganha o Guerreiro.

**Relíquias**: cada jogo com 100% das conquistas vira uma relíquia que dá +5 no atributo do gênero do jogo.

**Títulos**: cada conquista rara (menos de 5% dos jogadores) vira um título.

**Maldição do Backlog**: quem tem 10 ou mais jogos nunca abertos perde 1 de Sorte a cada 5 desses jogos.

**Batalha**: quem tem mais Agilidade começa e os dois se alternam até um cair.

- Vida = 100 + 5 × nível + Força
- Esquiva = Agilidade / 300 (máx. 30%)
- Resistência = Sabedoria / 200 (máx. 50% de redução de dano)
- Crítico = Sorte / 200 (máx. 50%, dano em dobro)

| Classe | Ataque | Dano | Especial |
|---|---|---|---|
| Guerreiro | Golpe de Espada | 10 + Força × 0,5 | mais vida (Força entra na vida) |
| Mago | Bola de Fogo | 8 + Inteligência × 0,5 | nunca é esquivada |
| Ladino | Ataque Duplo | 5 + Agilidade × 0,35 | ataca duas vezes |

Os perfis da Steam só detalham (gêneros e conquistas) os 25 jogos mais jogados, para não estourar o limite da API.

## Estrutura

```
src/
  contratos.ts            tipos compartilhados (interfaces de dados)
  main.ts                 o menu: lê o que o usuário digita e mostra o resultado
  cli/Tela.ts             monta os textos das telas
  dominio/
    Biblioteca.ts         responde perguntas sobre os jogos (horas, gêneros, conquistas)
    Personagem.ts         classe abstrata: vida, atributos, efeitos, títulos, golpes
    Guerreiro.ts Mago.ts Ladino.ts
    Efeito.ts             classe abstrata de tudo que mexe nos atributos
    Reliquia.ts MaldicaoDoBacklog.ts
    Titulo.ts
    atributos.ts          nomes e rótulos dos atributos
  regras/
    GeradorDePersonagem.ts  o balanceamento: biblioteca -> personagem
    Batalha.ts              turnos até alguém cair
  steam/
    FonteDePerfis.ts      interface: "me dá um perfil e os amigos dele"
    FonteFalsa.ts         usa os perfis falsos
    SteamService.ts       usa a API real da Steam
    erros.ts              erros próprios (perfil privado, não encontrado, chave inválida)
  dados-falsos/           perfis de teste
```

## Onde está cada conceito de POO

| Conceito | Onde olhar |
|---|---|
| Classe, construtor, `this` | `Biblioteca`, `Titulo` |
| Parâmetro e retorno | `Biblioteca.horasPorGenero`, `GeradorDePersonagem.calcular` |
| Método void (muda o estado) | `Personagem.adicionarEfeito`, `restaurarVida` |
| Encapsulamento (`private`, `get`, validação) | `Personagem` (construtor, `receberDano`, getters que devolvem cópias) |
| `readonly` e `static` | constantes de `Personagem`, `MaldicaoDoBacklog.seAplica` |
| Herança, `extends`, `super` | `Reliquia` e `MaldicaoDoBacklog` herdam de `Efeito`; os erros herdam de `Error` |
| `protected` | `Personagem.golpear` e `Personagem.resultado`, usados pelas subclasses |
| Classe e método abstratos | `Personagem.atacar`, `Efeito.aplicar` |
| Polimorfismo | `Batalha.lutar` chama `atacante.atacar(...)` sem saber a classe |
| `instanceof` | `Personagem.reliquias`, `Tela.erro`, `main.ts` |
| Interface e `implements` | `FonteDePerfis` com `FonteFalsa` e `SteamService` |
| Associação ("tem um") | `Personagem` tem efeitos e títulos |
| Generics | `SteamService.getJson<T>` |
| `try/catch` e `throw` | `main.ts` (o programa nunca cai), validações nas classes |
| Testes (Jest, padrão AAA) | arquivos `*.test.ts` |
