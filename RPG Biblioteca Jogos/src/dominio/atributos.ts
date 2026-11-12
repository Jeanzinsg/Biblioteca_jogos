import type { Atributos, NomeAtributo } from "../contratos.ts";

export const NOMES_DOS_ATRIBUTOS: NomeAtributo[] = [
  "forca",
  "agilidade",
  "inteligencia",
  "carisma",
  "sabedoria",
  "sorte",
];

export const ROTULOS_DOS_ATRIBUTOS: Record<NomeAtributo, string> = {
  forca: "Força",
  agilidade: "Agilidade",
  inteligencia: "Inteligência",
  carisma: "Carisma",
  sabedoria: "Sabedoria",
  sorte: "Sorte",
};

export function atributosZerados(): Atributos {
  return { forca: 0, agilidade: 0, inteligencia: 0, carisma: 0, sabedoria: 0, sorte: 0 };
}
