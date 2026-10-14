// Contratos entre as partes do projeto.
// Ninguém altera este arquivo sozinho: qualquer mudança é combinada no grupo antes.

export interface JogoSteam {
  appid: number;
  nome: string;
  horas: number;
  generos: string[];
  conquistasTotal: number;
  conquistasFeitas: number;
  conquistasRaras: string[]; // nomes das conquistas com menos de 5% globais
}

export interface PerfilSteam {
  steamId: string;
  nome: string;
  jogos: JogoSteam[];
}

export interface Atributos {
  forca: number;
  agilidade: number;
  inteligencia: number;
  carisma: number;
  sabedoria: number;
  sorte: number;
}

export type NomeClasse = "Guerreiro" | "Ladino" | "Mago" | "Bardo" | "Paladino";

export interface ResultadoCalculo {
  nivel: number;
  classe: NomeClasse;
  atributos: Atributos;
}
