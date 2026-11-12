import type { PerfilSteam, ResumoDeAmigo } from "../contratos.ts";

export interface FonteDePerfis {
  buscarPerfil(steamIdOuLink: string): Promise<PerfilSteam>;
  listarAmigos(steamId: string): Promise<ResumoDeAmigo[]>;
}
