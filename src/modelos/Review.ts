import { randomUUID } from "crypto";
import { Identificavel } from "../colecao/colecao.ts";
import { Notas } from "./Notas.ts";

export class Review implements Identificavel {
  readonly id: string;
  readonly data: string;

  constructor(
    public texto: string,
    public notas: Notas,
    public contemSpoiler: boolean = false,
    id?: string,
    data?: string
  ) {
    this.id = id ?? randomUUID();
    this.data = data ?? new Date().toISOString().slice(0, 10);
  }

  /** Nota geral calculada automaticamente (média ponderada). */
  notaGeral(): number {
    return this.notas.mediaPonderada();
  }

  /** Exibe a review; se houver spoiler e o usuário não pediu para revelar, o texto é ocultado. */
  exibir(revelarSpoiler: boolean = false): string {
    const textoExibido =
      this.contemSpoiler && !revelarSpoiler
        ? "[ ⚠ TEXTO OCULTO — CONTEM SPOILER ]"
        : this.texto;

    return [
      `Data: ${this.data}   Nota geral: ${this.notaGeral().toFixed(1)}`,
      `Criterios: ${this.notas.toString()}`,
      `Texto: ${textoExibido}`,
    ].join("\n");
  }
}
