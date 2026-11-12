import type { Atributos, JogoSteam, NomeAtributo, NomeClasse, PerfilSteam, ResultadoCalculo } from "../contratos.ts";
import { atributosZerados } from "../dominio/atributos.ts";
import { Biblioteca } from "../dominio/Biblioteca.ts";
import { Guerreiro } from "../dominio/Guerreiro.ts";
import { Ladino } from "../dominio/Ladino.ts";
import { Mago } from "../dominio/Mago.ts";
import { MaldicaoDoBacklog } from "../dominio/MaldicaoDoBacklog.ts";
import type { Personagem } from "../dominio/Personagem.ts";
import { Reliquia } from "../dominio/Reliquia.ts";
import { Titulo } from "../dominio/Titulo.ts";

type AtributoDeGenero = Exclude<NomeAtributo, "sorte">;

export class GeradorDePersonagem {
  static readonly GENEROS_POR_ATRIBUTO: Record<AtributoDeGenero, string[]> = {
    forca: ["Action"],
    agilidade: ["Racing", "Sports"],
    inteligencia: ["Strategy"],
    sabedoria: ["RPG", "Simulation", "Adventure"],
    carisma: ["Massively Multiplayer", "Casual", "Indie"],
  };

  static readonly PONTOS_MAXIMOS = 100;

  static pontosPorHoras(horas: number): number {
    if (horas < 0) {
      throw new Error("Horas não podem ser negativas.");
    }
    const pontos = Math.round(10 * Math.log2(1 + horas / 10));
    return Math.min(GeradorDePersonagem.PONTOS_MAXIMOS, pontos);
  }

  calcularAtributos(biblioteca: Biblioteca): Atributos {
    const atributos = atributosZerados();
    const generosPorAtributo = GeradorDePersonagem.GENEROS_POR_ATRIBUTO;

    for (const atributo of Object.keys(generosPorAtributo) as AtributoDeGenero[]) {
      let horas = 0;
      for (const genero of generosPorAtributo[atributo]) {
        horas += biblioteca.horasPorGenero(genero);
      }
      atributos[atributo] = GeradorDePersonagem.pontosPorHoras(horas);
    }

    atributos.sorte = Math.round(biblioteca.percentualDeConquistas());
    return atributos;
  }

  calcularNivel(biblioteca: Biblioteca): number {
    return Math.max(1, Math.floor(Math.sqrt(biblioteca.horasTotais())));
  }

  escolherClasse(atributos: Atributos): NomeClasse {
    let classe: NomeClasse = "Guerreiro";
    let maior = atributos.forca;

    if (atributos.inteligencia > maior) {
      classe = "Mago";
      maior = atributos.inteligencia;
    }
    if (atributos.agilidade > maior) {
      classe = "Ladino";
    }
    return classe;
  }

  calcular(biblioteca: Biblioteca): ResultadoCalculo {
    const atributos = this.calcularAtributos(biblioteca);
    return {
      nivel: this.calcularNivel(biblioteca),
      classe: this.escolherClasse(atributos),
      atributos,
    };
  }

  gerar(perfil: PerfilSteam): Personagem {
    const biblioteca = new Biblioteca(perfil.jogos);
    const calculo = this.calcular(biblioteca);
    const personagem = this.criar(calculo, perfil.nome);

    for (const jogo of biblioteca.jogosCompletos()) {
      personagem.adicionarEfeito(new Reliquia(jogo.nome, this.atributoDoJogo(jogo)));
    }

    for (const conquista of biblioteca.conquistasRaras()) {
      personagem.adicionarTitulo(new Titulo(conquista.nome, conquista.jogo));
    }

    const nuncaJogados = biblioteca.jogosNuncaJogados();
    if (MaldicaoDoBacklog.seAplica(nuncaJogados)) {
      personagem.adicionarEfeito(new MaldicaoDoBacklog(nuncaJogados));
    }

    personagem.restaurarVida();
    return personagem;
  }

  atributoDoJogo(jogo: JogoSteam): NomeAtributo {
    const generosPorAtributo = GeradorDePersonagem.GENEROS_POR_ATRIBUTO;
    for (const genero of jogo.generos) {
      for (const atributo of Object.keys(generosPorAtributo) as AtributoDeGenero[]) {
        if (generosPorAtributo[atributo].includes(genero)) {
          return atributo;
        }
      }
    }
    return "sorte";
  }

  private criar(calculo: ResultadoCalculo, nome: string): Personagem {
    switch (calculo.classe) {
      case "Guerreiro":
        return new Guerreiro(nome, calculo.nivel, calculo.atributos);
      case "Mago":
        return new Mago(nome, calculo.nivel, calculo.atributos);
      case "Ladino":
        return new Ladino(nome, calculo.nivel, calculo.atributos);
    }
  }
}
