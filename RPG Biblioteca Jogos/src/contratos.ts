export interface JogoSteam {
  nome: string;
  horas: number;
  generos: string[];
}

export interface PerfilSteam {
  steamId: string;
  nome: string;
  jogos: JogoSteam[];
}

export interface Atributos {
  forca: number;
  inteligencia: number;
  agilidade: number;
}

export interface Combatente {
  readonly nome: string;
  readonly vida: number;
  estaVivo(): boolean;
  receberDano(dano: number): void;
  atacar(alvo: Combatente): string;
}

export interface FonteDePerfis {
  buscarPerfil(steamId: string): Promise<PerfilSteam>;
}
