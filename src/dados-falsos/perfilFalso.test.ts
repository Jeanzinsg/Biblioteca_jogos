import { describe, expect, test } from "@jest/globals";
import { perfilFalso } from "./perfilFalso.ts";

// Garante que o perfil falso continua igual ao exemplo do plano.
describe("perfilFalso", () => {
  const horasPorGenero = (genero: string) =>
    perfilFalso.jogos
      .filter((jogo) => jogo.generos.includes(genero))
      .reduce((total, jogo) => total + jogo.horas, 0);

  test("tem as horas do exemplo de balanceamento", () => {
    expect(horasPorGenero("Action")).toBe(300);
    expect(horasPorGenero("Strategy")).toBe(120);
    expect(horasPorGenero("Racing")).toBe(40);
  });

  test("tem 35% das conquistas", () => {
    const feitas = perfilFalso.jogos.reduce((t, j) => t + j.conquistasFeitas, 0);
    const total = perfilFalso.jogos.reduce((t, j) => t + j.conquistasTotal, 0);
    expect((feitas / total) * 100).toBe(35);
  });
});
