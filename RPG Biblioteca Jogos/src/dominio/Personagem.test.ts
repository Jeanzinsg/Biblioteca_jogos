import { describe, expect, test } from "@jest/globals";
import type { Atributos } from "../contratos.ts";
import { atributosZerados } from "./atributos.ts";
import { Guerreiro } from "./Guerreiro.ts";
import { MaldicaoDoBacklog } from "./MaldicaoDoBacklog.ts";
import { Reliquia } from "./Reliquia.ts";
import { Titulo } from "./Titulo.ts";

function atributos(valores: Partial<Atributos>): Atributos {
  return { ...atributosZerados(), ...valores };
}

describe("Personagem", () => {
  test("não aceita nome vazio", () => {
    expect(() => new Guerreiro("  ", 1, atributosZerados())).toThrow("nome");
  });

  test("não aceita nível menor que 1", () => {
    expect(() => new Guerreiro("Teste", 0, atributosZerados())).toThrow("nível");
  });

  test("não aceita atributo negativo", () => {
    expect(() => new Guerreiro("Teste", 1, atributos({ forca: -1 }))).toThrow("negativos");
  });

  test("calcula a vida máxima pelo nível e pela força", () => {
    const guerreiro = new Guerreiro("Teste", 10, atributos({ forca: 20 }));
    expect(guerreiro.vidaMaxima).toBe(170);
    expect(guerreiro.vidaAtual).toBe(170);
  });

  test("relíquia soma bônus sem mudar os atributos base", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributos({ forca: 10 }));
    guerreiro.adicionarEfeito(new Reliquia("DARK SOULS III", "forca"));

    expect(guerreiro.atributos.forca).toBe(15);
    expect(guerreiro.atributosBase.forca).toBe(10);
    expect(guerreiro.reliquias()).toHaveLength(1);
  });

  test("mudar o objeto devolvido não altera o personagem", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributos({ forca: 10 }));
    guerreiro.atributosBase.forca = 999;
    guerreiro.efeitos.push(new Reliquia("Trapaça", "forca", 50));

    expect(guerreiro.atributos.forca).toBe(10);
  });

  test("maldição tira sorte mas nunca deixa negativa", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributos({ sorte: 2 }));
    guerreiro.adicionarEfeito(new MaldicaoDoBacklog(25));

    expect(guerreiro.atributos.sorte).toBe(0);
    expect(guerreiro.maldicao()?.penalidade()).toBe(5);
  });

  test("não aceita duas maldições", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributosZerados());
    guerreiro.adicionarEfeito(new MaldicaoDoBacklog(10));
    expect(() => guerreiro.adicionarEfeito(new MaldicaoDoBacklog(30))).toThrow("Maldição");
  });

  test("guarda os títulos", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributosZerados());
    guerreiro.adicionarTitulo(new Titulo("Steel Soul", "Hollow Knight"));
    expect(guerreiro.titulos.map((titulo) => titulo.descricao())).toEqual(['"Steel Soul" (Hollow Knight)']);
  });

  test("resistência reduz o dano recebido", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributos({ sabedoria: 100 }));
    expect(guerreiro.receberDano(40)).toBe(20);
    expect(guerreiro.vidaAtual).toBe(85);
  });

  test("vida nunca fica negativa", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributosZerados());
    guerreiro.receberDano(1000);
    expect(guerreiro.vidaAtual).toBe(0);
    expect(guerreiro.estaVivo()).toBe(false);
  });

  test("não aceita dano negativo", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributosZerados());
    expect(() => guerreiro.receberDano(-5)).toThrow("negativo");
  });

  test("personagem derrotado não pode atacar", () => {
    const derrotado = new Guerreiro("Derrotado", 1, atributosZerados());
    const alvo = new Guerreiro("Alvo", 1, atributosZerados());
    derrotado.receberDano(1000);
    expect(() => derrotado.atacar(alvo, () => 0.99)).toThrow("não pode atacar");
  });

  test("restaurar vida volta ao máximo", () => {
    const guerreiro = new Guerreiro("Teste", 1, atributosZerados());
    guerreiro.receberDano(50);
    guerreiro.restaurarVida();
    expect(guerreiro.vidaAtual).toBe(guerreiro.vidaMaxima);
  });
});

describe("Efeitos", () => {
  test("relíquia não aceita bônus zero ou negativo", () => {
    expect(() => new Reliquia("Jogo", "forca", 0)).toThrow("positivo");
  });

  test("maldição só existe a partir de 10 jogos nunca abertos", () => {
    expect(MaldicaoDoBacklog.seAplica(9)).toBe(false);
    expect(MaldicaoDoBacklog.seAplica(10)).toBe(true);
    expect(() => new MaldicaoDoBacklog(9)).toThrow("pelo menos 10");
  });
});
