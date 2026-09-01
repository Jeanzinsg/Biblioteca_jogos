import { Jogo } from "./jogo.ts";

export class Plataforma {
    nome: string;
    jogos: Jogo[];

    constructor(nome: string){
        this.nome = nome;   
        this.jogos = [];
    }

}

