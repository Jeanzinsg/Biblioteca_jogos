import { Biblioteca } from "./Biblioteca.ts";
import type { Atributos, PerfilSteam } from "./contratos.ts";
import { ChefeDoBacklog } from "./personagens/ChefeDoBacklog.ts";
import { Guerreiro } from "./personagens/Guerreiro.ts";
import { Ladino } from "./personagens/Ladino.ts";
import { Mago } from "./personagens/Mago.ts";
import type { Personagem } from "./personagens/Personagem.ts";

export class Gerador {
  static readonly GENEROS_DE_FORCA = ["Action", "Adventure"];
  static readonly GENEROS_DE_INTELIGENCIA = ["Strategy", "Simulation", "RPG"];
  static readonly GENEROS_DE_AGILIDADE = ["Racing", "Sports", "Casual", "Indie"];

  static pontos(horas: number): number {
    return Math.min(100, Math.round(horas / 5));
  }

  calcularAtributos(biblioteca: Biblioteca): Atributos {
    return {
      forca: Gerador.pontos(biblioteca.horasNosGeneros(Gerador.GENEROS_DE_FORCA)),
      inteligencia: Gerador.pontos(biblioteca.horasNosGeneros(Gerador.GENEROS_DE_INTELIGENCIA)),
      agilidade: Gerador.pontos(biblioteca.horasNosGeneros(Gerador.GENEROS_DE_AGILIDADE)),
    };
  }

  calcularNivel(biblioteca: Biblioteca): number {
    const nivel = Math.floor(biblioteca.horasTotais() / 20);
    return Math.min(50, Math.max(1, nivel));
  }

  criarHeroi(perfil: PerfilSteam): Personagem {
    const biblioteca = new Biblioteca(perfil.jogos);
    const atributos = this.calcularAtributos(biblioteca);
    const nivel = this.calcularNivel(biblioteca);
    const arma = biblioteca.jogoMaisJogado();

    if (atributos.inteligencia > atributos.forca && atributos.inteligencia >= atributos.agilidade) {
      return new Mago(perfil.nome, nivel, atributos, arma);
    }
    if (atributos.agilidade > atributos.forca && atributos.agilidade > atributos.inteligencia) {
      return new Ladino(perfil.nome, nivel, atributos, arma);
    }
    return new Guerreiro(perfil.nome, nivel, atributos, arma);
  }

  criarChefe(perfil: PerfilSteam): ChefeDoBacklog {
    const biblioteca = new Biblioteca(perfil.jogos);
    return new ChefeDoBacklog(perfil.nome, biblioteca.jogosNuncaJogados());
  }
}
