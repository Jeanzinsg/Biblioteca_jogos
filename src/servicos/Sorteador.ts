import { StatusJogo } from "../enums/enums.ts";
import { DadosInvalidosError } from "../erros/Erros.ts";
import { Jogo } from "../modelos/Jogo.ts";

export class Sorteador {
  constructor(private readonly jogos: Jogo[]) {}

  /**
   * "O que jogar agora?": recebe o tempo disponível em horas e sorteia
   * um jogo do backlog (ou em andamento) cujas horas restantes estimadas caibam nesse tempo.
   * Se nada couber exatamente, devolve o de menor duração restante do backlog.
   */
  oQueJogarAgora(tempoDisponivelHoras: number): Jogo | null {
    if (tempoDisponivelHoras <= 0) {
      throw new DadosInvalidosError("O tempo disponível deve ser maior que zero.");
    }

    const candidatos = this.jogos.filter(
      (j) => j.status === StatusJogo.BACKLOG || j.status === StatusJogo.JOGANDO
    );
    if (candidatos.length === 0) return null;

    const compativeis = candidatos.filter((j) => j.horasRestantesEstimadas <= tempoDisponivelHoras);

    if (compativeis.length > 0) {
      const indice = Math.floor(Math.random() * compativeis.length);
      return compativeis[indice]!;
    }

    // Fallback: o mais curto que sobrou
    return [...candidatos].sort((a, b) => a.horasRestantesEstimadas - b.horasRestantesEstimadas)[0]!;
  }
}
