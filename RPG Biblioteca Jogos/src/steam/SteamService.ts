import type { JogoSteam, PerfilSteam, ResumoDeAmigo } from "../contratos.ts";
import { ChaveInvalidaError, ErroSteam, PerfilNaoEncontradoError, PerfilPrivadoError } from "./erros.ts";
import type { FonteDePerfis } from "./FonteDePerfis.ts";

export type Buscador = (url: string) => Promise<Response>;

interface JogadorSteam {
  steamid: string;
  personaname: string;
  communityvisibilitystate: number;
}

interface JogoDaApi {
  appid: number;
  name?: string;
  playtime_forever: number;
}

interface ConquistaDaApi {
  apiname: string;
  achieved: number;
  name?: string;
}

interface RespostaApelido {
  response: { success: number; steamid?: string };
}

interface RespostaJogadores {
  response: { players: JogadorSteam[] };
}

interface RespostaJogos {
  response: { game_count?: number; games?: JogoDaApi[] };
}

interface RespostaConquistas {
  playerstats?: { achievements?: ConquistaDaApi[] };
}

interface RespostaPercentuais {
  achievementpercentages?: { achievements?: { name: string; percent: number | string }[] };
}

type RespostaLoja = Record<string, { success: boolean; data?: { genres?: { description: string }[] } }>;

interface RespostaAmigos {
  friendslist?: { friends: { steamid: string }[] };
}

interface DadosDeConquistas {
  conquistasTotal: number;
  conquistasFeitas: number;
  conquistasRaras: string[];
}

export class SteamService implements FonteDePerfis {
  static readonly API = "https://api.steampowered.com";
  static readonly LOJA = "https://store.steampowered.com/api";
  static readonly PERFIL_PUBLICO = 3;
  static readonly MAXIMO_DE_JOGOS_DETALHADOS = 25;
  static readonly JOGOS_POR_LOTE = 5;
  static readonly RARIDADE_MAXIMA = 5;
  static readonly MAXIMO_DE_AMIGOS = 100;

  constructor(
    private readonly _chave: string,
    private readonly _buscar: Buscador = (url) => fetch(url),
  ) {
    if (_chave.trim().length === 0) {
      throw new Error("A chave da API da Steam não foi informada.");
    }
  }

  async buscarPerfil(steamIdOuLink: string): Promise<PerfilSteam> {
    const steamId = await this.resolverSteamId(steamIdOuLink);
    const [jogador] = await this.buscarJogadores([steamId]);
    if (jogador === undefined) {
      throw new PerfilNaoEncontradoError(steamIdOuLink);
    }
    if (jogador.communityvisibilitystate !== SteamService.PERFIL_PUBLICO) {
      throw new PerfilPrivadoError(`O perfil de ${jogador.personaname} é privado na Steam.`);
    }
    const jogos = await this.buscarJogos(steamId, jogador.personaname);
    return { steamId, nome: jogador.personaname, jogos };
  }

  async listarAmigos(steamId: string): Promise<ResumoDeAmigo[]> {
    const resposta = await this.requisitar(
      `${SteamService.API}/ISteamUser/GetFriendList/v1/?key=${this.chave()}&steamid=${steamId}&relationship=friend`,
    );
    if (resposta.status === 401 || resposta.status === 403) {
      throw new PerfilPrivadoError("A lista de amigos deste perfil é privada.");
    }
    if (!resposta.ok) {
      throw new ErroSteam(`A Steam respondeu com erro ${resposta.status} ao buscar os amigos.`);
    }
    const dados = await this.lerJson<RespostaAmigos>(resposta);
    const ids = (dados.friendslist?.friends ?? [])
      .map((amigo) => amigo.steamid)
      .slice(0, SteamService.MAXIMO_DE_AMIGOS);
    if (ids.length === 0) {
      return [];
    }
    const jogadores = await this.buscarJogadores(ids);
    return jogadores
      .map((jogador) => ({ steamId: jogador.steamid, nome: jogador.personaname }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async resolverSteamId(steamIdOuLink: string): Promise<string> {
    const texto = steamIdOuLink.trim().replace(/\/+$/, "");

    const idDoLink = texto.match(/steamcommunity\.com\/profiles\/(\d{17})/)?.[1];
    if (idDoLink !== undefined) {
      return idDoLink;
    }

    const apelido = texto.match(/steamcommunity\.com\/id\/([^/?#]+)/)?.[1] ?? texto;
    if (/^\d{17}$/.test(apelido)) {
      return apelido;
    }
    if (apelido.length === 0) {
      throw new PerfilNaoEncontradoError(steamIdOuLink);
    }

    const dados = await this.getJson<RespostaApelido>(
      `${SteamService.API}/ISteamUser/ResolveVanityURL/v1/?key=${this.chave()}&vanityurl=${encodeURIComponent(apelido)}`,
    );
    if (dados.response.success !== 1 || dados.response.steamid === undefined) {
      throw new PerfilNaoEncontradoError(steamIdOuLink);
    }
    return dados.response.steamid;
  }

  private async buscarJogadores(steamIds: string[]): Promise<JogadorSteam[]> {
    const dados = await this.getJson<RespostaJogadores>(
      `${SteamService.API}/ISteamUser/GetPlayerSummaries/v2/?key=${this.chave()}&steamids=${steamIds.join(",")}`,
    );
    return dados.response.players;
  }

  private async buscarJogos(steamId: string, nome: string): Promise<JogoSteam[]> {
    const dados = await this.getJson<RespostaJogos>(
      `${SteamService.API}/IPlayerService/GetOwnedGames/v1/?key=${this.chave()}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`,
    );
    const { game_count, games } = dados.response;
    if (games === undefined) {
      if (game_count === 0) {
        return [];
      }
      throw new PerfilPrivadoError(`Os detalhes de jogos de ${nome} são privados na Steam.`);
    }

    const maisJogados = new Set(
      games
        .filter((jogo) => jogo.playtime_forever > 0)
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .slice(0, SteamService.MAXIMO_DE_JOGOS_DETALHADOS)
        .map((jogo) => jogo.appid),
    );

    const resultado: JogoSteam[] = [];
    for (let i = 0; i < games.length; i += SteamService.JOGOS_POR_LOTE) {
      const lote = games.slice(i, i + SteamService.JOGOS_POR_LOTE);
      const detalhados = await Promise.all(
        lote.map((jogo) => (maisJogados.has(jogo.appid) ? this.detalharJogo(steamId, jogo) : this.jogoSimples(jogo))),
      );
      resultado.push(...detalhados);
    }
    return resultado;
  }

  private jogoSimples(jogo: JogoDaApi): JogoSteam {
    return {
      appid: jogo.appid,
      nome: jogo.name ?? `App ${jogo.appid}`,
      horas: Math.round((jogo.playtime_forever / 60) * 10) / 10,
      generos: [],
      conquistasTotal: 0,
      conquistasFeitas: 0,
      conquistasRaras: [],
    };
  }

  private async detalharJogo(steamId: string, jogo: JogoDaApi): Promise<JogoSteam> {
    const [generos, conquistas] = await Promise.all([
      this.buscarGeneros(jogo.appid),
      this.buscarConquistas(steamId, jogo.appid),
    ]);
    return { ...this.jogoSimples(jogo), generos, ...conquistas };
  }

  private async buscarGeneros(appid: number): Promise<string[]> {
    const dados = await this.tentarJson<RespostaLoja>(
      `${SteamService.LOJA}/appdetails?appids=${appid}&filters=genres&l=english`,
    );
    const generos = dados?.[String(appid)]?.data?.genres ?? [];
    return generos.map((genero) => genero.description);
  }

  private async buscarConquistas(steamId: string, appid: number): Promise<DadosDeConquistas> {
    const dados = await this.tentarJson<RespostaConquistas>(
      `${SteamService.API}/ISteamUserStats/GetPlayerAchievements/v1/?key=${this.chave()}&steamid=${steamId}&appid=${appid}&l=portuguese`,
    );
    const todas = dados?.playerstats?.achievements ?? [];
    const feitas = todas.filter((conquista) => conquista.achieved === 1);
    if (feitas.length === 0) {
      return { conquistasTotal: todas.length, conquistasFeitas: 0, conquistasRaras: [] };
    }

    const percentuais = await this.buscarPercentuais(appid);
    const raras = feitas
      .filter((conquista) => {
        const percentual = percentuais.get(conquista.apiname);
        return percentual !== undefined && percentual < SteamService.RARIDADE_MAXIMA;
      })
      .map((conquista) => conquista.name ?? conquista.apiname);

    return { conquistasTotal: todas.length, conquistasFeitas: feitas.length, conquistasRaras: raras };
  }

  private async buscarPercentuais(appid: number): Promise<Map<string, number>> {
    const dados = await this.tentarJson<RespostaPercentuais>(
      `${SteamService.API}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appid}`,
    );
    const percentuais = new Map<string, number>();
    for (const conquista of dados?.achievementpercentages?.achievements ?? []) {
      percentuais.set(conquista.name, Number(conquista.percent));
    }
    return percentuais;
  }

  private chave(): string {
    return encodeURIComponent(this._chave.trim());
  }

  private async requisitar(url: string): Promise<Response> {
    try {
      return await this._buscar(url);
    } catch {
      throw new ErroSteam("Não foi possível conectar à Steam. Verifique sua internet.");
    }
  }

  private async getJson<T>(url: string): Promise<T> {
    const resposta = await this.requisitar(url);
    if (resposta.status === 401 || resposta.status === 403) {
      throw new ChaveInvalidaError();
    }
    if (!resposta.ok) {
      throw new ErroSteam(`A Steam respondeu com erro ${resposta.status}. Tente de novo em alguns minutos.`);
    }
    return this.lerJson<T>(resposta);
  }

  private async tentarJson<T>(url: string): Promise<T | undefined> {
    try {
      const resposta = await this._buscar(url);
      if (!resposta.ok) {
        return undefined;
      }
      return (await resposta.json()) as T;
    } catch {
      return undefined;
    }
  }

  private async lerJson<T>(resposta: Response): Promise<T> {
    try {
      return (await resposta.json()) as T;
    } catch {
      throw new ErroSteam("A Steam enviou uma resposta que não deu para ler.");
    }
  }
}
