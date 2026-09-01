import { Review } from "./review.ts";

export class Jogo{
    nome: string;
    categoria: string;
    plataforma: string;
    review?: Review;

    constructor(nome: string, categoria: string, plataforma: string, review?: Review){
        this.nome = nome;
        this.categoria = categoria;
        this.plataforma = plataforma;
        if(review){
            this.review = review;
        }
    }
}