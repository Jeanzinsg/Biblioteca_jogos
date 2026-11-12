import { describe, expect, test } from "@jest/globals";
import type { Atributos } from "../contratos.ts";
import { atributosZerados } from "../dominio/atributos.ts";
import { Guerreiro } from "../dominio/Guerreiro.ts";
import { Ladino } from "../dominio/Ladino.ts";
import { Mago } from "../dominio/Mago.ts";
import { perfilFalso, perfilFalsoMago } from "../dados-falsos/perfilFalso.ts";
import { Batalha } from "./Batalha.ts";
import { GeradorDePersonagem } from "./GeradorDePersonagem.ts";

const nuncaEsquivaNemCritica = () => 0.99;
const sempreEsquivaESempreCritica = () => 0;

function atributos(valores: Partial<Atributos>): Atributos {
  return { ...atributosZerados(), ...valores };
}

describe("Batalha", () => {
  const gerador = new GeradorDePersonagem();

  test("termina com um vencedor e um derrotado", () => {
    const guerreiro = gerador.gerar(perfilFalso);
    const mago = gerador.gerar(perfilFalsoMago);

    const resultado = new Batalha(guerreiro, mago, nuncaEsquivaNemCritica).lutar();

    expect(resultado.vencedor).toBeDefined();
    expect(guerreiro.estaVivo() !== mago.estaVivo()).toBe(true);
    expect(resultado.ataques.at(-1)?.alvoDerrotado).toBe(true);
  });

  test("quem tem mais agilidade começa", () => {
    const lento = new Guerreiro("Lento", 1, atributos({ agilidade: 1 }));
    const rapido = new Ladino("Rápido", 1, atributos({ agilidade: 50 }));

    const resultado = new Batalha(lento, rapido, nuncaEsquivaNemCritica).lutar();

    expect(resultado.ataques[0]?.atacante).toBe("Rápido");
  });

  test("os personagens se alternam", () => {
    const a = new Guerreiro("A", 1, atributosZerados());
    const b = new Guerreiro("B", 1, atributosZerados());

    const atacantes = new Batalha(a, b, nuncaEsquivaNemCritica).lutar().ataques.map((ataque) => ataque.atacante);

    expect(atacantes.slice(0, 4)).toEqual(["A", "B", "A", "B"]);
  });

  test("ataque do guerreiro pode ser esquivado", () => {
    const guerreiro = new Guerreiro("Guerreiro", 1, atributosZerados());
    const esquivo = new Ladino("Esquivo", 1, atributos({ agilidade: 90 }));

    const ataque = guerreiro.atacar(esquivo, sempreEsquivaESempreCritica);

    expect(ataque.golpes[0]?.acertou).toBe(false);
    expect(ataque.danoTotal).toBe(0);
  });

  test("bola de fogo do mago nunca é esquivada", () => {
    const mago = new Mago("Mago", 1, atributos({ inteligencia: 20 }));
    const esquivo = new Ladino("Esquivo", 1, atributos({ agilidade: 90 }));

    const ataque = mago.atacar(esquivo, nuncaEsquivaNemCritica);

    expect(ataque.golpes[0]?.acertou).toBe(true);
    expect(ataque.danoTotal).toBe(18);
  });

  test("ladino ataca duas vezes", () => {
    const ladino = new Ladino("Ladino", 1, atributos({ agilidade: 20 }));
    const alvo = new Guerreiro("Alvo", 10, atributosZerados());

    const ataque = ladino.atacar(alvo, nuncaEsquivaNemCritica);

    expect(ataque.golpes).toHaveLength(2);
    expect(ataque.danoTotal).toBe(24);
  });

  test("crítico dobra o dano", () => {
    const guerreiro = new Guerreiro("Guerreiro", 1, atributos({ forca: 20, sorte: 100 }));
    const alvo = new Guerreiro("Alvo", 10, atributosZerados());

    const ataque = guerreiro.atacar(alvo, () => 0.4);

    expect(ataque.golpes[0]?.critico).toBe(true);
    expect(ataque.danoTotal).toBe(40);
  });

  test("termina em empate se ninguém consegue acertar", () => {
    const a = new Ladino("A", 1, atributos({ agilidade: 90 }));
    const b = new Ladino("B", 1, atributos({ agilidade: 90 }));

    const resultado = new Batalha(a, b, sempreEsquivaESempreCritica).lutar();

    expect(resultado.vencedor).toBeUndefined();
    expect(resultado.ataques).toHaveLength(Batalha.LIMITE_DE_ATAQUES);
  });

  test("restaura a vida antes de lutar", () => {
    const a = new Guerreiro("A", 1, atributosZerados());
    const b = new Guerreiro("B", 1, atributosZerados());
    a.receberDano(1000);

    expect(() => new Batalha(a, b, nuncaEsquivaNemCritica).lutar()).not.toThrow();
  });

  test("não deixa lutar contra si mesmo", () => {
    const a = new Guerreiro("A", 1, atributosZerados());
    expect(() => new Batalha(a, a)).toThrow("ele mesmo");
  });
});
