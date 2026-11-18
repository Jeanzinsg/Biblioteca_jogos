import type { JogoSteam, PerfilSteam } from "../contratos.ts";

function nuncaJogados(nomes: string[]): JogoSteam[] {
  return nomes.map((nome) => ({ nome, horas: 0, generos: [] }));
}

export const perfisFalsos: PerfilSteam[] = [
  {
    steamId: "guerreiro",
    nome: "Torreta",
    jogos: [
      { nome: "DARK SOULS III", horas: 180, generos: ["Action"] },
      { nome: "Hollow Knight", horas: 120, generos: ["Action", "Adventure"] },
      { nome: "Sid Meier's Civilization VI", horas: 40, generos: ["Strategy"] },
      ...nuncaJogados(["Sekiro", "Elden Ring", "Lies of P"]),
    ],
  },
  {
    steamId: "mago",
    nome: "Nebacetin",
    jogos: [
      { nome: "Crusader Kings III", horas: 400, generos: ["Strategy", "Simulation"] },
      { nome: "Stardew Valley", horas: 150, generos: ["Indie", "RPG", "Simulation"] },
      { nome: "Portal 2", horas: 25, generos: ["Action", "Adventure"] },
      ...nuncaJogados(["Disco Elysium", "Pillars of Eternity", "XCOM 2", "Frostpunk"]),
    ],
  },
  {
    steamId: "ladino",
    nome: "Véio",
    jogos: [
      { nome: "Forza Horizon 5", horas: 200, generos: ["Racing", "Sports"] },
      { nome: "Rocket League", horas: 150, generos: ["Sports", "Racing", "Indie"] },
      { nome: "Celeste", horas: 30, generos: ["Action", "Indie"] },
      ...nuncaJogados(["F1 24", "Need for Speed Unbound"]),
    ],
  },
  {
    steamId: "colecionador",
    nome: "Homo",
    jogos: [
      { nome: "Counter-Strike 2", horas: 60, generos: ["Action"] },
      { nome: "Vampire Survivors", horas: 20, generos: ["Action", "Casual"] },
      ...nuncaJogados([
        "Cyberpunk 2077",
        "The Witcher 3",
        "Red Dead Redemption 2",
        "Baldur's Gate 3",
        "Elden Ring",
        "Hades",
        "Outer Wilds",
        "Death Stranding",
        "Persona 5 Royal",
        "Starfield",
        "Hollow Knight: Silksong",
        "Terraria",
      ]),
    ],
  },
];
