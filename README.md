# Biblioteca de Jogos

Gerenciador de coleção de jogos em linha de comando. Você cadastra seus jogos (físicos e digitais), registra progresso e horas jogadas, escreve reviews com notas por critério, acompanha estatísticas da coleção e ainda pede uma sugestão de "o que jogar agora" com base no tempo livre que você tem. Tudo é salvo em um arquivo JSON local.

Projeto desenvolvido para a disciplina de Programação Orientada a Objetos (SENAC).

## Funcionalidades

**Coleção**

- Cadastrar jogos **físicos** (com local de guarda) ou **digitais** (com launcher e espaço em disco)
- Listar a biblioteca em tabela, ver detalhes, editar e remover jogos
- Status do jogo: Jogando, Zerado, Backlog, Abandonado, Wishlist

**Progresso**

- Registrar horas jogadas, percentual de conclusão e datas de início/término
- Atualização automática de status: 100% vira *Zerado*; começar um jogo do backlog vira *Jogando*
- Cálculo de horas restantes estimadas

**Reviews**

- Nota de 0 a 10 em quatro critérios: jogabilidade, história, trilha sonora e gráficos
- Nota geral por **média ponderada** (jogabilidade 40%, gráficos 25%, história 20%, trilha 15%)
- Marcação de spoiler: o texto fica oculto até você pedir para revelar
- Vários reviews por jogo, com média consolidada

**Estatísticas**

- Taxa de conclusão da coleção (desconsiderando a wishlist)
- Gênero mais frequente, total de horas e total investido
- Custo por hora de um jogo (valor pago ÷ horas jogadas)
- Distribuição por plataforma, com tabela e gráfico de barras em texto

**Busca e recomendação**

- Filtros por plataforma, nota mínima, gênero, status, ano de lançamento e termo livre
- Ordenação por nota, ano ou horas jogadas
- **O que jogar agora?** — sorteia um jogo do backlog ou já em andamento cujas horas restantes caibam no tempo disponível (se nada couber, sugere o mais curto)

**Persistência**

- Salva e recarrega a coleção em `dados/colecao.json`
- Salvamento automático ao sair pelo menu

## Tecnologias

- TypeScript
- Node.js
- [tsx](https://www.npmjs.com/package/tsx) para executar TypeScript direto, sem build
- [readline-sync](https://www.npmjs.com/package/readline-sync) para entrada de dados no terminal
- [Jest](https://jestjs.io/) + Babel para os testes

## Estrutura do projeto

```
src/
  index.ts              Ponto de entrada: instancia e executa o Menu
  cli/
    Menu.ts             Menu principal e todo o fluxo de interação
    Entrada.ts          Leitura de texto, número, booleano e opções
  modelos/
    Jogo.ts             Classe abstrata base (dados, progresso, reviews)
    JogoFisico.ts       Subclasse: local de guarda
    JogoDigital.ts      Subclasse: launcher e espaço em GB
    Review.ts           Review com data, texto e controle de spoiler
    Notas.ts            Notas por critério e cálculo das médias
    progresso.ts        Interface Progresso (horas, %, datas)
  servicos/
    Persistencia.ts     Leitura e gravação do JSON (conversão via DTOs)
    Estatisticas.ts     Métricas e tabela de distribuição
    Filtros.ts          Filtros e ordenações da biblioteca
    Sorteador.ts        Sugestão de jogo pelo tempo disponível
  colecao/
    colecao.ts          Colecao<T> genérica + interface Identificavel
  interfaces/
    Avaliavel.ts        Contrato de quem recebe reviews
    Pesquisavel.ts      Contrato de quem é buscável por termo
  enums/
    enums.ts            StatusJogo e Formato
  erros/
    Erros.ts            ErroColecao e suas subclasses
dados/
  colecao.json          Onde a coleção é gravada
sum.test.ts             Testes (Jest)
```

### Conceitos de POO aplicados

- **Herança e classe abstrata**: `Jogo` define o contrato; `JogoFisico` e `JogoDigital` o completam
- **Polimorfismo**: `exibirDetalhes()` e o getter `formato` se comportam conforme a subclasse
- **Encapsulamento**: a `Colecao` esconde seu `Map` interno e expõe apenas operações
- **Generics**: `Colecao<T extends Identificavel>` serve tanto para jogos quanto para reviews
- **Interfaces**: `Avaliavel`, `Pesquisavel` e `Identificavel`
- **Composição**: cada jogo possui sua própria coleção de reviews
- **Hierarquia de exceções**: `ErroColecao` e as filhas `JogoNaoEncontradoError`, `DadosInvalidosError` e `PersistenciaError`

## Como rodar

Pré-requisito: Node.js 18 ou superior (testado na 24).

1. Clone o repositório:

```bash
git clone https://github.com/Jeanzinsg/Biblioteca_jogos.git
```

2. Entre na pasta do projeto e instale as dependências:

```bash
cd Biblioteca_jogos
npm install
```

3. Execute o projeto:

```bash
npm start
```

O programa precisa de um terminal interativo de verdade — ele lê as teclas direto do console, então não funciona com a entrada vinda de pipe ou de arquivo.

### Outros comandos

```bash
npm test         # roda os testes com Jest
npm run typecheck   # verifica os tipos sem gerar arquivos
```

## Integrantes

- Jean Garcia — [@Jeanzinsg](https://github.com/Jeanzinsg)
- Leonardo Ribeiro Borges — [@Ashkor7](https://github.com/Ashkor7)
- Junin — @usuario
- Blumberg — @usuario
