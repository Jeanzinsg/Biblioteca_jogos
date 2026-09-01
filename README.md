# Biblioteca de Jogos

Sistema de linha de comando para organizar sua coleção de jogos por console. Você cadastra os consoles que possui, adiciona os jogos de cada um e registra avaliações (nota e comentário) para os jogos que já jogou.

Projeto desenvolvido para a disciplina de Programação Orientada a Objetos (SENAC).

## Funcionalidades

- Cadastrar consoles (com verificação de duplicados)
- Adicionar jogos a um console específico (nome e categoria)
- Avaliar um jogo com nota de 0 a 10 e um comentário
- Listar todos os consoles e seus respectivos jogos

## Tecnologias

- TypeScript
- Node.js
- [prompt-sync](https://www.npmjs.com/package/prompt-sync) para entrada de dados pelo terminal

## Estrutura do projeto

```
src/
  jogos/
    jogo.ts         Classe Jogo (nome, categoria, plataforma, review)
    plataforma.ts   Classe Plataforma (console + lista de jogos)
    review.ts       Classe Review (nota + comentário)
main.ts             Menu principal e fluxo do programa
```

## Como rodar

Pré-requisito: Node.js 22 ou superior (necessário para executar arquivos TypeScript diretamente).

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
node main.ts
```

## Integrantes

- Jean Garcia — [@Jeanzinsg](https://github.com/Jeanzinsg)
- Junin — @usuario
- Blumberg — @usuario
- Leo — @usuario