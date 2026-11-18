import { describe, expect, test } from "@jest/globals";
import { Biblioteca } from "./Biblioteca.ts";

const biblioteca = new Biblioteca([
  { nome: "DARK SOULS III", horas: 100, generos: ["Action"] },
  { nome: "Portal 2", horas: 20, generos: ["Action", "Adventure"] },
  { nome: "Civilization VI", horas: 50, generos: ["Strategy"] },
  { nome: "Cyberpunk 2077", horas: 0, generos: [] },
]);

describe("Biblioteca", () => {
  test("soma as horas de todos os jogos", () => {
    expect(biblioteca.horasTotais()).toBe(170);
  });

  test("conta cada jogo uma vez só, mesmo com dois gêneros da lista", () => {
    expect(biblioteca.horasNosGeneros(["Action", "Adventure"])).toBe(120);
  });

  test("acha o jogo mais jogado", () => {
    expect(biblioteca.jogoMaisJogado()).toBe("DARK SOULS III");
  });

  test("lista os jogos com 0 horas", () => {
    expect(biblioteca.jogosNuncaJogados()).toEqual(["Cyberpunk 2077"]);
  });
});
