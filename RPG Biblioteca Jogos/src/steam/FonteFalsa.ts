import type { FonteDePerfis, PerfilSteam } from "../contratos.ts";
import { perfisFalsos } from "./perfisFalsos.ts";

export class FonteFalsa implements FonteDePerfis {
  idsDisponiveis(): string[] {
    return perfisFalsos.map((perfil) => perfil.steamId);
  }

  async buscarPerfil(steamId: string): Promise<PerfilSteam> {
    for (const perfil of perfisFalsos) {
      if (perfil.steamId === steamId.trim()) {
        return perfil;
      }
    }
    throw new Error(`Nenhum perfil encontrado com o ID "${steamId}".`);
  }
}
