import type { FonteDePerfis, JogoSteam, PerfilSteam } from "../contratos.ts";

interface JogoDaApi {
  appid: number;
  name: string;
  playtime_forever: number;
}

export class SteamService implements FonteDePerfis {
  static readonly API = "https://api.steampowered.com";
  static readonly JOGOS_COM_GENERO = 10;

  constructor(private readonly chave: string) {
    if (chave.trim() === "") {
      throw new Error("A chave da API da Steam não foi informada.");
    }
  }

  async buscarPerfil(steamId: string): Promise<PerfilSteam> {
    const id = steamId.trim();
    if (!/^\d{17}$/.test(id)) {
      throw new Error("O Steam ID precisa ter 17 números.");
    }

    const resumo = await this.pegarJson(
      `${SteamService.API}/ISteamUser/GetPlayerSummaries/v2/?key=${this.chave}&steamids=${id}`,
    );
    const jogador = resumo.response.players[0];
    if (jogador === undefined) {
      throw new Error(`Nenhum perfil encontrado com o ID "${id}".`);
    }

    const biblioteca = await this.pegarJson(
      `${SteamService.API}/IPlayerService/GetOwnedGames/v1/?key=${this.chave}&steamid=${id}&include_appinfo=1`,
    );
    const jogosDaApi: JogoDaApi[] | undefined = biblioteca.response.games;
    if (jogosDaApi === undefined) {
      throw new Error(`A biblioteca de ${jogador.personaname} está privada na Steam.`);
    }

    jogosDaApi.sort((a, b) => b.playtime_forever - a.playtime_forever);
    const jogos: JogoSteam[] = [];
    for (let i = 0; i < jogosDaApi.length; i++) {
      const jogo = jogosDaApi[i]!;
      const generos = i < SteamService.JOGOS_COM_GENERO ? await this.buscarGeneros(jogo.appid) : [];
      jogos.push({ nome: jogo.name, horas: Math.round(jogo.playtime_forever / 60), generos });
    }
    return { steamId: id, nome: jogador.personaname, jogos };
  }

  private async buscarGeneros(appid: number): Promise<string[]> {
    try {
      const dados = await this.pegarJson(
        `https://store.steampowered.com/api/appdetails?appids=${appid}&filters=genres&l=english`,
      );
      const generos: { description: string }[] = dados[appid]?.data?.genres ?? [];
      return generos.map((genero) => genero.description);
    } catch {
      return [];
    }
  }

  private async pegarJson(url: string): Promise<any> {
    const resposta = await fetch(url);
    if (resposta.status === 401 || resposta.status === 403) {
      throw new Error("A Steam recusou a chave. Confira o STEAM_API_KEY no arquivo .env.");
    }
    if (!resposta.ok) {
      throw new Error(`A Steam respondeu com erro ${resposta.status}.`);
    }
    return resposta.json();
  }
}
