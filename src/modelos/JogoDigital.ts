import { Formato } from "../enums/enums.ts";
import { DadosInvalidosError } from "../erros/Erros.ts";
import { DadosJogo, Jogo } from "./Jogo.ts";

export class JogoDigital extends Jogo {
  espacoGB: number;
  launcher: string; // ex.: Steam, PS Store, Xbox App

  constructor(dados: DadosJogo, espacoGB: number, launcher: string) {
    super(dados);
    if (espacoGB < 0) throw new DadosInvalidosError("Espaço em GB nao pode ser negativo.");
    this.espacoGB = espacoGB;
    this.launcher = launcher;
  }

  get formato(): Formato {
    return Formato.DIGITAL;
  }

  exibirDetalhes(): string {
    return [
      "=== JOGO DIGITAL ===",
      this.detalhesBase(),
      `Launcher:        ${this.launcher}`,
      `Espaco em disco: ${this.espacoGB} GB`,
    ].join("\n");
  }
}
