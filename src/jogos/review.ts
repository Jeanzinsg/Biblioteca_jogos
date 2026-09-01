
export class Review{
    nota: number;
    texto?: string

    constructor(nota: number, texto?: string){
        this.nota = nota;
        if(texto){
            this.texto = texto;
        }
    }
}
