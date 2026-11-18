import { describe, expect, test } from "@jest/globals";
import { Batalha } from "./Batalha.ts";
import { ChefeDoBacklog } from "./personagens/ChefeDoBacklog.ts";
import { Guerreiro } from "./personagens/Guerreiro.ts";
import { Mago } from "./personagens/Mago.ts";

const atributos = { forca: 40, inteligencia: 40, agilidade: 0 };

function jogarAteOFim(batalha: Batalha): void {
  while (!batalha.acabou()) {
    batalha.jogarRodada();
  }
}

describe("Batalha", () => {
  test("não começa sem heróis", () => {
    const chefe = new ChefeDoBacklog("Alguém", ["Jogo"]);
    expect(() => new Batalha([], chefe)).toThrow("pelo menos um");
  });

  test("todos os heróis do grupo atacam na mesma rodada", () => {
    const chefe = new ChefeDoBacklog("Alguém", ["A", "B", "C", "D", "E"]);
    const grupo = [new Guerreiro("G", 10, atributos, "x"), new Mago("M", 10, atributos, "y")];
    const batalha = new Batalha(grupo, chefe);

    const relato = batalha.jogarRodada();

    expect(relato).toHaveLength(3);
    expect(chefe.vida).toBe(400 - 30 - 39);
  });

  test("um grupo forte zera um backlog pequeno", () => {
    const chefe = new ChefeDoBacklog("Alguém", ["Jogo"]);
    const batalha = new Batalha([new Guerreiro("G", 20, atributos, "x")], chefe);

    jogarAteOFim(batalha);

    expect(batalha.heroisVenceram()).toBe(true);
  });

  test("um herói fraco perde para um backlog gigante", () => {
    const parados = Array.from({ length: 30 }, (_, i) => `Jogo ${i}`);
    const chefe = new ChefeDoBacklog("Alguém", parados);
    const batalha = new Batalha([new Mago("M", 1, atributos, "y")], chefe);

    jogarAteOFim(batalha);

    expect(batalha.heroisVenceram()).toBe(false);
  });

  test("não deixa jogar depois que acabou", () => {
    const chefe = new ChefeDoBacklog("Alguém", ["Jogo"]);
    const batalha = new Batalha([new Guerreiro("G", 50, atributos, "x")], chefe);

    jogarAteOFim(batalha);

    expect(() => batalha.jogarRodada()).toThrow("acabou");
  });
});
