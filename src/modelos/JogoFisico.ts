import { Formato } from "../enums/enums.ts";
import { DadosJogo, Jogo } from "./Jogo.ts";

export class JogoFisico extends Jogo {
  localGuarda: string; // ex.: "Prateleira 2, caixa azul"

  constructor(dados: DadosJogo, localGuarda: string) {
    super(dados);
    this.localGuarda = localGuarda;
  }

  get formato(): Formato {
    return Formato.FISICO;
  }

  exibirDetalhes(): string {
    return [
      "=== JOGO FÍSICO ===",
      this.detalhesBase(),
      `Local de guarda: ${this.localGuarda}`,
    ].join("\n");
  }
}
