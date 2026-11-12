import type { Atributos } from "../contratos.ts";
import { Efeito } from "./Efeito.ts";

export class MaldicaoDoBacklog extends Efeito {
  static readonly MINIMO_DE_JOGOS = 10;
  static readonly JOGOS_POR_PONTO = 5;

  constructor(private readonly _jogosNuncaJogados: number) {
    super("Maldição do Backlog");
    if (!MaldicaoDoBacklog.seAplica(_jogosNuncaJogados)) {
      throw new Error(
        `A maldição só atinge quem tem pelo menos ${MaldicaoDoBacklog.MINIMO_DE_JOGOS} jogos nunca abertos.`,
      );
    }
  }

  static seAplica(jogosNuncaJogados: number): boolean {
    return jogosNuncaJogados >= MaldicaoDoBacklog.MINIMO_DE_JOGOS;
  }

  get jogosNuncaJogados(): number {
    return this._jogosNuncaJogados;
  }

  penalidade(): number {
    return Math.floor(this._jogosNuncaJogados / MaldicaoDoBacklog.JOGOS_POR_PONTO);
  }

  descricao(): string {
    return `${this._jogosNuncaJogados} jogos nunca abertos: -${this.penalidade()} de Sorte`;
  }

  aplicar(atributos: Atributos): Atributos {
    return { ...atributos, sorte: Math.max(0, atributos.sorte - this.penalidade()) };
  }
}
