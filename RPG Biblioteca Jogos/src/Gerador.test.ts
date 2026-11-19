import { describe, expect, test } from "@jest/globals";
import type { PerfilSteam } from "./contratos.ts";
import { Gerador } from "./Gerador.ts";

const gerador = new Gerador();

function perfil(generos: string[], horas: number): PerfilSteam {
  return {
    steamId: "teste",
    nome: "Teste",
    jogos: [
      { nome: "Favorito", horas, generos },
      { nome: "Comprado e esquecido", horas: 0, generos: [] },
    ],
  };
}

describe("Gerador", () => {
  test("transforma horas em pontos, até 100", () => {
    expect(Gerador.pontos(50)).toBe(10);
    expect(Gerador.pontos(5000)).toBe(100);
  });

  test("quem joga ação vira Guerreiro", () => {
    expect(gerador.criarHeroi(perfil(["Action"], 100)).classe()).toBe("Guerreiro");
  });

  test("quem joga estratégia vira Mago", () => {
    expect(gerador.criarHeroi(perfil(["Strategy"], 100)).classe()).toBe("Mago");
  });

  test("quem joga corrida vira Ladino", () => {
    expect(gerador.criarHeroi(perfil(["Racing"], 100)).classe()).toBe("Ladino");
  });

  test("o nível sobe 1 a cada 20 horas", () => {
    expect(gerador.criarHeroi(perfil(["Action"], 200)).nivel).toBe(10);
    expect(gerador.criarHeroi(perfil(["Action"], 5)).nivel).toBe(1);
  });

  test("o jogo mais jogado vira a arma", () => {
    expect(gerador.criarHeroi(perfil(["Action"], 100)).arma).toBe("Favorito");
  });

  test("o chefe nasce dos jogos nunca jogados", () => {
    const chefe = gerador.criarChefe(perfil(["Action"], 100));
    expect(chefe.tamanho).toBe(1);
    expect(chefe.nome).toBe("Acumulador de Poeira de Teste");
  });
});
