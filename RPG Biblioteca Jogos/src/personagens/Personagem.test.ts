import { describe, expect, test } from "@jest/globals";
import { ChefeDoBacklog } from "./ChefeDoBacklog.ts";
import { Guerreiro } from "./Guerreiro.ts";
import { Ladino } from "./Ladino.ts";
import { Mago } from "./Mago.ts";

const atributos = { forca: 20, inteligencia: 20, agilidade: 30 };

describe("Personagem", () => {
  test("não aceita nome vazio", () => {
    expect(() => new Guerreiro("  ", 1, atributos, "Espada")).toThrow("nome");
  });

  test("não aceita nível menor que 1", () => {
    expect(() => new Mago("Teste", 0, atributos, "Cajado")).toThrow("nível");
  });

  test("cada classe calcula a vida do seu jeito", () => {
    expect(new Guerreiro("A", 10, atributos, "x").vida).toBe(170);
    expect(new Mago("B", 10, atributos, "x").vida).toBe(130);
    expect(new Ladino("C", 10, atributos, "x").vida).toBe(150);
  });

  test("não recebe dano depois de derrotado", () => {
    const ladino = new Ladino("Teste", 1, atributos, "Adaga");
    ladino.receberDano(1000);

    expect(ladino.estaVivo()).toBe(false);
    expect(() => ladino.receberDano(10)).toThrow("derrotado");
  });

  test("não aceita dano negativo", () => {
    const mago = new Mago("Teste", 1, atributos, "Cajado");
    expect(() => mago.receberDano(-5)).toThrow("negativo");
  });

  test("o ladino acerta duas vezes", () => {
    const chefe = new ChefeDoBacklog("Alguém", ["Jogo Parado"]);
    const ladino = new Ladino("Teste", 1, atributos, "Adaga");

    ladino.atacar(chefe);

    expect(chefe.vida).toBe(160 - 2 * 16);
  });
});

describe("ChefeDoBacklog", () => {
  test("não existe sem jogos parados", () => {
    expect(() => new ChefeDoBacklog("Zerador", [])).toThrow("Sem backlog");
  });

  test("fica mais forte a cada ataque", () => {
    const chefe = new ChefeDoBacklog("Alguém", ["A", "B"]);
    const guerreiro = new Guerreiro("Teste", 50, atributos, "Espada");

    chefe.atacar(guerreiro);
    const vidaDepoisDoPrimeiro = guerreiro.vida;
    chefe.atacar(guerreiro);

    expect(guerreiro.vida).toBe(370 - 12 - 15);
    expect(vidaDepoisDoPrimeiro).toBe(370 - 12);
  });
});
