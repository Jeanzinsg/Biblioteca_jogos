import { describe, expect, test } from "@jest/globals";
import { perfilFalso, perfilFalsoMago } from "../dados-falsos/perfilFalso.ts";
import { Biblioteca } from "./Biblioteca.ts";

describe("Biblioteca", () => {
  const biblioteca = new Biblioteca(perfilFalso.jogos);
  const bibliotecaDoMago = new Biblioteca(perfilFalsoMago.jogos);
  const vazia = new Biblioteca([]);

  test("soma as horas de um gênero", () => {
    expect(biblioteca.horasPorGenero("Action")).toBe(300);
    expect(biblioteca.horasPorGenero("Strategy")).toBe(120);
    expect(biblioteca.horasPorGenero("Racing")).toBe(40);
  });

  test("divide as horas de um jogo entre os seus gêneros", () => {
    expect(bibliotecaDoMago.horasPorGenero("Simulation")).toBe(250);
    expect(bibliotecaDoMago.horasPorGenero("Strategy")).toBe(200);
  });

  test("calcula as horas totais", () => {
    expect(biblioteca.horasTotais()).toBe(460);
  });

  test("calcula o percentual geral de conquistas", () => {
    expect(biblioteca.percentualDeConquistas()).toBe(35);
  });

  test("encontra o gênero mais jogado", () => {
    expect(biblioteca.generoMaisJogado()).toBe("Action");
    expect(bibliotecaDoMago.generoMaisJogado()).toBe("Simulation");
  });

  test("lista os jogos com 100% das conquistas", () => {
    expect(biblioteca.jogosCompletos().map((jogo) => jogo.nome)).toEqual(["DARK SOULS III"]);
  });

  test("lista as conquistas raras com o jogo de origem", () => {
    expect(biblioteca.conquistasRaras()).toEqual([{ nome: "Steel Soul", jogo: "Hollow Knight" }]);
  });

  test("conta os jogos nunca abertos", () => {
    expect(bibliotecaDoMago.jogosNuncaJogados()).toBe(25);
    expect(biblioteca.jogosNuncaJogados()).toBe(0);
  });

  test("biblioteca vazia não quebra", () => {
    expect(vazia.quantidadeDeJogos()).toBe(0);
    expect(vazia.horasTotais()).toBe(0);
    expect(vazia.percentualDeConquistas()).toBe(0);
    expect(vazia.generoMaisJogado()).toBeUndefined();
    expect(vazia.jogosCompletos()).toEqual([]);
  });

  test("jogo sem conquistas não conta como completo", () => {
    const semConquistas = new Biblioteca([
      { appid: 1, nome: "Sem Conquistas", horas: 10, generos: [], conquistasTotal: 0, conquistasFeitas: 0, conquistasRaras: [] },
    ]);
    expect(semConquistas.jogosCompletos()).toEqual([]);
  });
});
