import prompt from "prompt-sync";
import { Jogo } from "./src/jogos/jogo.ts";
import { Review } from "./src/jogos/review.ts";
import { Plataforma } from "./src/jogos/plataforma.ts";
const teclado = prompt();
const consoles: Plataforma[] = [];

function addConsole() {
    let newConsole = (teclado("Digite o nome do console para adicionar: "));
    if (consoles.some((plat) => newConsole === plat.nome)){
        console.log("Esse dispositivo já está na sua lista");
    } else {
        consoles.push(new Plataforma(newConsole));
        console.log("Console adicionado!"); 
    }
}

function addJogo (){
    const jaConsole = (teclado("Em qual console você jogou seu jogo? "));
    const achado = consoles.find((j) => jaConsole === j.nome);
    if (achado){
        const gameName = teclado("Qual nome do jogo? ");
        const gameCat = teclado("E qual a categoria dele? ");
        if (achado.jogos.some((g) => gameName === g.nome)){
            console.log("Esse jogo já está na sua lista!");
        } else {
            achado.jogos.push(new Jogo(gameName, gameCat, achado.nome));
            console.log("Jogo adicionado a sua lista");
        }
    } else {
        console.log("Esse console não está na sua lista.");
    }
}

function listaGeral () {
    if (consoles.length <= 0){
        console.log("Sua Lista está vazia!");
    } else{
        console.log("Lista de Consoles e Jogos");
        for (const plat of consoles){
            console.log(">>", plat.nome);
            for (const j of plat.jogos){
                console.log("   - ", j.nome);
            }
        }
    }
}

function reviewGame () {
    listaGeral()
    const consoleReview = teclado("Em qual console está o jogo que você quer avaliar? ");
    const consoleSelect = consoles.find((c) => consoleReview === c.nome);
    if (consoleSelect){
        const gameName = teclado("Qual dos jogos você gostaria de avaliar? ");
        const gameSelect = consoleSelect.jogos.find((g) => gameName === g.nome);
        if (gameSelect){
            const notaGame = +(teclado("Numa escala de 0 a 10 qual nota você dá para esse jogo: "));
            const reviewGame = teclado("Descreva brevemente o porque dessa nota");
            gameSelect.review = (new Review(notaGame, reviewGame));
            console.log("Avaliação adicionado ao seu jogo");
        } else {
            console.log("O jogo que você escolheu não exite ou foi digitado de forma errada.");
        }
    } else{
        console.log("O console escolhido não existe ou foi digitado de forma errada.");
    }
}

// MENU PRINCIPAL
let onMenu = true
while(onMenu){
    console.log("  ")
    console.log("------------------------------------")
    console.log("|Biblioteca de jogos dos Batutinhas|")
    console.log("------------------------------------")
    console.log("1 - Ver tudo que tenho")
    console.log("2 - Fazer Review de um Jogo")
    console.log("3 - Adicionar console")
    console.log("4 - Adicionar Jogo")
    console.log("0 - Sair")
    console.log("  ")
    const opcao = +(teclado("O que você gostaria de fazer agora? "))
    switch (opcao){
        case 1:
            listaGeral();
            break;
        case 2:
            reviewGame();
            break;
        case 3:
            addConsole();
            break;
        case 4:
            addJogo();
            break;
        case 0:
            onMenu = false;
            console.log("Até a próxima!");
            break
        default:
            console.log("Opção Invalida!");
            break;
    }
}

