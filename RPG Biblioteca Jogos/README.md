# Steam RPG: A Revolta do Backlog

Todo mundo que usa a Steam tem aquela pilha de jogos comprados na promoção e nunca abertos: o **backlog**.
Neste jogo, ele criou vida e virou um chefe.

- As **horas que você jogou** viram o seu herói (classe, nível, atributos e arma).
- Os **jogos que você nunca abriu** viram o **Chefe do Backlog**, que joga esses jogos em você.
- Se o seu backlog for grande demais, **chame amigos**: cada perfil da Steam vira mais um herói no grupo.

Projeto autoral de Programação Orientada a Objetos (Senac), em TypeScript, com interface de terminal.

## Como rodar

```bash
npm install
npm start
```

Sem chave, o jogo roda em **modo de teste** com 4 perfis prontos: `guerreiro`, `mago`, `ladino` e `colecionador`.
Dica: escolha `colecionador` (12 jogos parados) e tente vencer sozinho. Depois chame os outros três.

Para usar a Steam de verdade:

1. Gere uma chave em https://steamcommunity.com/dev/apikey
2. Copie `.env.example` para `.env` e cole a chave em `STEAM_API_KEY`
3. Use o Steam ID de 17 números (aparece no link do perfil ou em https://steamid.io)
4. O perfil e os **detalhes de jogos** precisam estar públicos nas configurações de privacidade da Steam

Outros comandos: `npm test` (testes) e `npm run typecheck` (confere os tipos).

## Regras

**Atributos**: cada 5 horas em um gênero vale 1 ponto (máximo 100).

| Atributo | Gêneros da Steam |
|---|---|
| Força | Action, Adventure |
| Inteligência | Strategy, Simulation, RPG |
| Agilidade | Racing, Sports, Casual, Indie |

**Nível**: 1 a cada 20 horas jogadas (de 1 a 50). **Arma lendária**: o seu jogo mais jogado.

**Classe**: o maior atributo decide. Empate fica com o Guerreiro.

| Classe | Vida | Ataque |
|---|---|---|
| Guerreiro | 100 + 5 × nível + Força | 10 + Força ÷ 2 |
| Mago | 100 + 5 × nível − 20 | 15 + Inteligência × 0,6 |
| Ladino | 100 + 5 × nível | 6 + Agilidade ÷ 3, duas vezes |

**Chefe do Backlog**: 100 + 60 de vida por jogo nunca aberto. A cada rodada ele arremessa um desses jogos
em um herói, e o dano cresce 3 a cada rodada (o backlog só aumenta!). Quem não tem nenhum jogo parado não tem chefe.

**Rodada**: todos os heróis vivos atacam, depois o chefe ataca um herói. Acaba quando o chefe ou o grupo inteiro cai.

## Estrutura

```
src/
  main.ts                 menu: lê o que o usuário digita e mostra o resultado
  contratos.ts            interfaces (JogoSteam, PerfilSteam, Atributos, Combatente, FonteDePerfis)
  Biblioteca.ts           perguntas sobre os jogos: horas, gêneros, mais jogado, nunca jogados
  Gerador.ts              transforma um perfil em herói e em chefe
  Batalha.ts              as rodadas do grupo contra o chefe
  personagens/
    Personagem.ts         classe abstrata dos heróis
    Guerreiro.ts Mago.ts Ladino.ts
    ChefeDoBacklog.ts     o chefe (não é Personagem, mas é Combatente)
  steam/
    FonteFalsa.ts         perfis de teste (perfisFalsos.ts)
    SteamService.ts       API real da Steam
```

## Onde está cada conceito de POO

| Conceito | Onde olhar |
|---|---|
| Classe, objeto, construtor | `Biblioteca`, `Gerador` |
| Encapsulamento (`private`, `get`) | `Personagem` (`_vida` só muda por `receberDano`) |
| `static` e `readonly` | `Gerador.pontos`, `ChefeDoBacklog.VIDA_POR_JOGO`, `Batalha.TAMANHO_MAXIMO_DO_GRUPO` |
| Herança, `extends`, `super` | `Guerreiro`, `Mago` e `Ladino` herdam de `Personagem`; `super.vidaMaxima()` |
| `protected` | `Personagem.atributos`, usado pelas subclasses |
| Sobrescrita (`override`) | `vidaMaxima()` no `Guerreiro` e no `Mago` |
| Classe e método abstratos (Quest 1) | `Personagem` e os métodos `classe()`, `habilidade()`, `atacar()` |
| Polimorfismo com array da superclasse (Quest 2) | `main.ts` (`mostrarGrupo`) e `Batalha.jogarRodada` percorrem um `Personagem[]` |
| Interface e `implements` | `Combatente` (heróis e chefe), `FonteDePerfis` (`FonteFalsa` e `SteamService`) |
| `instanceof` | `main.ts` (`fonte instanceof FonteFalsa`, `erro instanceof Error`) |
| `throw` e `try/catch` (Quest 3) | validações nas classes; `main.ts` mostra o erro e o menu continua |
| `async/await` | `FonteDePerfis.buscarPerfil`, `SteamService` |
| Testes (Jest, padrão AAA) | arquivos `*.test.ts` |
