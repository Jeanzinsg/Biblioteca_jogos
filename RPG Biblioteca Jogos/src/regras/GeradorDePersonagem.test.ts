import { describe, expect, test } from "@jest/globals";
import { atributosZerados } from "../dominio/atributos.ts";
import { Biblioteca } from "../dominio/Biblioteca.ts";
import { Guerreiro } from "../dominio/Guerreiro.ts";
import { Mago } from "../dominio/Mago.ts";
import { perfilFalso, perfilFalsoMago } from "../dados-falsos/perfilFalso.ts";
import { GeradorDePersonagem } from "./GeradorDePersonagem.ts";

describe("GeradorDePersonagem", () => {
  const gerador = new GeradorDePersonagem();

  test("transforma horas em pontos com retorno decrescente", () => {
    expect(GeradorDePersonagem.pontosPorHoras(0)).toBe(0);
    expect(GeradorDePersonagem.pontosPorHoras(40)).toBe(23);
    expect(GeradorDePersonagem.pontosPorHoras(120)).toBe(37);
    expect(GeradorDePersonagem.pontosPorHoras(300)).toBe(50);
    expect(GeradorDePersonagem.pontosPorHoras(1_000_000)).toBe(100);
  });

  test("não aceita horas negativas", () => {
    expect(() => GeradorDePersonagem.pontosPorHoras(-1)).toThrow("negativas");
  });

  test("calcula o exemplo de balanceamento", () => {
    const calculo = gerador.calcular(new Biblioteca(perfilFalso.jogos));

    expect(calculo.classe).toBe("Guerreiro");
    expect(calculo.nivel).toBe(21);
    expect(calculo.atributos).toEqual({
      forca: 50,
      agilidade: 23,
      inteligencia: 37,
      carisma: 0,
      sabedoria: 0,
      sorte: 35,
    });
  });

  test("biblioteca vazia vira nível 1", () => {
    expect(gerador.calcularNivel(new Biblioteca([]))).toBe(1);
  });

  test("escolhe a classe pelo maior atributo principal", () => {
    expect(gerador.escolherClasse({ ...atributosZerados(), forca: 10, inteligencia: 30, agilidade: 20 })).toBe("Mago");
    expect(gerador.escolherClasse({ ...atributosZerados(), forca: 10, inteligencia: 5, agilidade: 20 })).toBe("Ladino");
    expect(gerador.escolherClasse(atributosZerados())).toBe("Guerreiro");
  });

  test("gera um Guerreiro com relíquia e título", () => {
    const personagem = gerador.gerar(perfilFalso);

    expect(personagem).toBeInstanceOf(Guerreiro);
    expect(personagem.nome).toBe("Aventureiro Falso");
    expect(personagem.atributos.forca).toBe(55);
    expect(personagem.reliquias().map((reliquia) => reliquia.nome)).toEqual(["Relíquia de DARK SOULS III"]);
    expect(personagem.titulos.map((titulo) => titulo.nome)).toEqual(["Steel Soul"]);
    expect(personagem.maldicao()).toBeUndefined();
  });

  test("gera um Mago amaldiçoado pelo backlog", () => {
    const personagem = gerador.gerar(perfilFalsoMago);

    expect(personagem).toBeInstanceOf(Mago);
    expect(personagem.nivel).toBe(23);
    expect(personagem.atributosBase.sorte).toBe(21);
    expect(personagem.atributos.sorte).toBe(16);
    expect(personagem.maldicao()?.jogosNuncaJogados).toBe(25);
  });

  test("relíquia usa o primeiro gênero que tem atributo", () => {
    const jogo = perfilFalsoMago.jogos[1];
    expect(jogo?.nome).toBe("Stardew Valley");
    if (jogo !== undefined) {
      expect(gerador.atributoDoJogo(jogo)).toBe("carisma");
    }
  });

  test("jogo sem gênero conhecido dá relíquia de sorte", () => {
    const jogo = { appid: 1, nome: "Misterioso", horas: 1, generos: ["Utilities"], conquistasTotal: 1, conquistasFeitas: 1, conquistasRaras: [] };
    expect(gerador.atributoDoJogo(jogo)).toBe("sorte");
  });
});
