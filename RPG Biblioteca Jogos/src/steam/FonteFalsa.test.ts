import { describe, expect, test } from "@jest/globals";
import { FonteFalsa } from "./FonteFalsa.ts";

describe("FonteFalsa", () => {
  const fonte = new FonteFalsa();

  test("acha um perfil de teste pelo ID", async () => {
    const perfil = await fonte.buscarPerfil("mago");
    expect(perfil.nome).toBe("Nebacetin");
  });

  test("dá erro com um ID que não existe", async () => {
    await expect(fonte.buscarPerfil("ninguem")).rejects.toThrow("Nenhum perfil");
  });
});
