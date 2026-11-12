import { describe, expect, test } from "@jest/globals";
import { perfilFalso, perfilFalsoMago } from "../dados-falsos/perfilFalso.ts";
import { PerfilNaoEncontradoError } from "./erros.ts";
import { FonteFalsa } from "./FonteFalsa.ts";

describe("FonteFalsa", () => {
  const fonte = new FonteFalsa();

  test("encontra um perfil pelo Steam ID", async () => {
    await expect(fonte.buscarPerfil(perfilFalso.steamId)).resolves.toBe(perfilFalso);
  });

  test("avisa quando o perfil não existe", async () => {
    await expect(fonte.buscarPerfil("123")).rejects.toBeInstanceOf(PerfilNaoEncontradoError);
  });

  test("os amigos são os outros perfis", async () => {
    const amigos = await fonte.listarAmigos(perfilFalso.steamId);
    expect(amigos).toEqual([{ steamId: perfilFalsoMago.steamId, nome: perfilFalsoMago.nome }]);
  });
});
