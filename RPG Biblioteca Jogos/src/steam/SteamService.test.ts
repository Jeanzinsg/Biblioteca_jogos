import { describe, expect, test } from "@jest/globals";
import { ChaveInvalidaError, ErroSteam, PerfilNaoEncontradoError, PerfilPrivadoError } from "./erros.ts";
import { SteamService, type Buscador } from "./SteamService.ts";

const STEAM_ID = "76561190000000001";

interface Rota {
  trecho: string;
  status?: number;
  corpo: unknown;
}

function steamDeMentira(rotas: Rota[]): { buscar: Buscador; urls: string[] } {
  const urls: string[] = [];
  const buscar: Buscador = async (url) => {
    urls.push(url);
    const rota = rotas.find((r) => url.includes(r.trecho));
    if (rota === undefined) {
      return new Response("{}", { status: 404 });
    }
    return new Response(JSON.stringify(rota.corpo), { status: rota.status ?? 200 });
  };
  return { buscar, urls };
}

const jogadorPublico: Rota = {
  trecho: "GetPlayerSummaries",
  corpo: { response: { players: [{ steamid: STEAM_ID, personaname: "Jogador", communityvisibilitystate: 3 }] } },
};

describe("SteamService", () => {
  test("não aceita chave vazia", () => {
    expect(() => new SteamService(" ")).toThrow("chave");
  });

  test("aceita Steam ID, link de perfil e link com apelido", async () => {
    const { buscar } = steamDeMentira([
      { trecho: "ResolveVanityURL", corpo: { response: { success: 1, steamid: STEAM_ID } } },
    ]);
    const steam = new SteamService("chave", buscar);

    await expect(steam.resolverSteamId(STEAM_ID)).resolves.toBe(STEAM_ID);
    await expect(steam.resolverSteamId(`https://steamcommunity.com/profiles/${STEAM_ID}/`)).resolves.toBe(STEAM_ID);
    await expect(steam.resolverSteamId("https://steamcommunity.com/id/apelido")).resolves.toBe(STEAM_ID);
  });

  test("avisa quando o apelido não existe", async () => {
    const { buscar } = steamDeMentira([{ trecho: "ResolveVanityURL", corpo: { response: { success: 42 } } }]);
    const steam = new SteamService("chave", buscar);

    await expect(steam.buscarPerfil("ninguem")).rejects.toBeInstanceOf(PerfilNaoEncontradoError);
  });

  test("avisa quando o perfil é privado", async () => {
    const { buscar } = steamDeMentira([
      {
        trecho: "GetPlayerSummaries",
        corpo: { response: { players: [{ steamid: STEAM_ID, personaname: "Tímido", communityvisibilitystate: 1 }] } },
      },
    ]);
    const steam = new SteamService("chave", buscar);

    await expect(steam.buscarPerfil(STEAM_ID)).rejects.toBeInstanceOf(PerfilPrivadoError);
  });

  test("avisa quando os jogos são privados", async () => {
    const { buscar } = steamDeMentira([jogadorPublico, { trecho: "GetOwnedGames", corpo: { response: {} } }]);
    const steam = new SteamService("chave", buscar);

    await expect(steam.buscarPerfil(STEAM_ID)).rejects.toThrow("privados");
  });

  test("avisa quando a chave é recusada", async () => {
    const { buscar } = steamDeMentira([{ trecho: "GetPlayerSummaries", status: 403, corpo: {} }]);
    const steam = new SteamService("chave", buscar);

    await expect(steam.buscarPerfil(STEAM_ID)).rejects.toBeInstanceOf(ChaveInvalidaError);
  });

  test("avisa quando não tem internet", async () => {
    const steam = new SteamService("chave", async () => {
      throw new TypeError("fetch failed");
    });

    await expect(steam.buscarPerfil(STEAM_ID)).rejects.toBeInstanceOf(ErroSteam);
  });

  test("monta o perfil com horas, gêneros e conquistas raras", async () => {
    const { buscar } = steamDeMentira([
      jogadorPublico,
      {
        trecho: "GetOwnedGames",
        corpo: {
          response: {
            game_count: 2,
            games: [
              { appid: 10, name: "Jogo Favorito", playtime_forever: 6000 },
              { appid: 20, name: "Nunca Aberto", playtime_forever: 0 },
            ],
          },
        },
      },
      { trecho: "appdetails", corpo: { "10": { success: true, data: { genres: [{ description: "Action" }] } } } },
      {
        trecho: "GetPlayerAchievements",
        corpo: {
          playerstats: {
            achievements: [
              { apiname: "COMUM", achieved: 1, name: "Comum" },
              { apiname: "RARA", achieved: 1, name: "Muito Rara" },
              { apiname: "FALTANDO", achieved: 0, name: "Faltando" },
            ],
          },
        },
      },
      {
        trecho: "GetGlobalAchievementPercentagesForApp",
        corpo: {
          achievementpercentages: {
            achievements: [
              { name: "COMUM", percent: 60 },
              { name: "RARA", percent: "1.5" },
              { name: "FALTANDO", percent: 0.1 },
            ],
          },
        },
      },
    ]);
    const steam = new SteamService("chave", buscar);

    const perfil = await steam.buscarPerfil(STEAM_ID);

    expect(perfil.nome).toBe("Jogador");
    expect(perfil.jogos).toEqual([
      {
        appid: 10,
        nome: "Jogo Favorito",
        horas: 100,
        generos: ["Action"],
        conquistasTotal: 3,
        conquistasFeitas: 2,
        conquistasRaras: ["Muito Rara"],
      },
      {
        appid: 20,
        nome: "Nunca Aberto",
        horas: 0,
        generos: [],
        conquistasTotal: 0,
        conquistasFeitas: 0,
        conquistasRaras: [],
      },
    ]);
  });

  test("lista amigos em ordem alfabética", async () => {
    const { buscar } = steamDeMentira([
      { trecho: "GetFriendList", corpo: { friendslist: { friends: [{ steamid: "2" }, { steamid: "3" }] } } },
      {
        trecho: "GetPlayerSummaries",
        corpo: {
          response: {
            players: [
              { steamid: "2", personaname: "Zeca", communityvisibilitystate: 3 },
              { steamid: "3", personaname: "Ana", communityvisibilitystate: 3 },
            ],
          },
        },
      },
    ]);
    const steam = new SteamService("chave", buscar);

    await expect(steam.listarAmigos(STEAM_ID)).resolves.toEqual([
      { steamId: "3", nome: "Ana" },
      { steamId: "2", nome: "Zeca" },
    ]);
  });

  test("lista de amigos privada vira PerfilPrivadoError", async () => {
    const { buscar } = steamDeMentira([{ trecho: "GetFriendList", status: 401, corpo: {} }]);
    const steam = new SteamService("chave", buscar);

    await expect(steam.listarAmigos(STEAM_ID)).rejects.toBeInstanceOf(PerfilPrivadoError);
  });
});
