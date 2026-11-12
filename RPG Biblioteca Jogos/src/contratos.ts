export interface JogoSteam {
  appid: number;
  nome: string;
  horas: number;
  generos: string[];
  conquistasTotal: number;
  conquistasFeitas: number;
  conquistasRaras: string[];
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

export type NomeAtributo = keyof Atributos;

export type NomeClasse = "Guerreiro" | "Mago" | "Ladino";

export interface ResultadoCalculo {
  nivel: number;
  classe: NomeClasse;
  atributos: Atributos;
}

export interface ConquistaRara {
  nome: string;
  jogo: string;
}

export interface ResumoDeAmigo {
  steamId: string;
  nome: string;
}

export type Sorteio = () => number;

export interface Golpe {
  acertou: boolean;
  critico: boolean;
  dano: number;
}

export interface ResultadoAtaque {
  atacante: string;
  alvo: string;
  habilidade: string;
  golpes: Golpe[];
  danoTotal: number;
  vidaRestanteDoAlvo: number;
  alvoDerrotado: boolean;
}

export interface ResultadoBatalha {
  vencedor: string | undefined;
  ataques: ResultadoAtaque[];
}
