import type { PerfilSteam, ResumoDeAmigo } from "../contratos.ts";
import { perfisFalsos } from "../dados-falsos/perfilFalso.ts";
import { PerfilNaoEncontradoError } from "./erros.ts";
import type { FonteDePerfis } from "./FonteDePerfis.ts";

export class FonteFalsa implements FonteDePerfis {
  constructor(private readonly _perfis: PerfilSteam[] = perfisFalsos) {}

  perfisDisponiveis(): ResumoDeAmigo[] {
    return this._perfis.map((perfil) => ({ steamId: perfil.steamId, nome: perfil.nome }));
  }

  async buscarPerfil(steamIdOuLink: string): Promise<PerfilSteam> {
    const perfil = this._perfis.find((p) => p.steamId === steamIdOuLink.trim());
    if (perfil === undefined) {
      throw new PerfilNaoEncontradoError(steamIdOuLink);
    }
    return perfil;
  }

  async listarAmigos(steamId: string): Promise<ResumoDeAmigo[]> {
    await this.buscarPerfil(steamId);
    return this.perfisDisponiveis().filter((perfil) => perfil.steamId !== steamId);
  }
}
