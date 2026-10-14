import type { JogoSteam, PerfilSteam } from "../contratos.ts";

// Perfil do exemplo da seção de balanceamento:
// 300h de Action, 120h de Strategy, 40h de Racing e 35% de conquistas.
// Resultado esperado: Guerreiro nível 21, Força 50, Inteligência 37, Agilidade 23, Sorte 35.
// Todos os jogos têm 20 conquistas, então os 35% batem tanto pela média por jogo
// quanto pela soma geral (28 de 80).
export const perfilFalso: PerfilSteam = {
  steamId: "76561190000000001",
  nome: "Aventureiro Falso",
  jogos: [
    {
      appid: 374320,
      nome: "DARK SOULS III",
      horas: 180,
      generos: ["Action"],
      conquistasTotal: 20,
      conquistasFeitas: 20, // 100%: vira relíquia
      conquistasRaras: [],
    },
    {
      appid: 367520,
      nome: "Hollow Knight",
      horas: 120,
      generos: ["Action"],
      conquistasTotal: 20,
      conquistasFeitas: 4,
      conquistasRaras: ["Steel Soul"], // vira título
    },
    {
      appid: 289070,
      nome: "Sid Meier's Civilization VI",
      horas: 120,
      generos: ["Strategy"],
      conquistasTotal: 20,
      conquistasFeitas: 3,
      conquistasRaras: [],
    },
    {
      appid: 1551360,
      nome: "Forza Horizon 5",
      horas: 40,
      generos: ["Racing"],
      conquistasTotal: 20,
      conquistasFeitas: 1,
      conquistasRaras: [],
    },
  ],
};

// 25 jogos nunca abertos, para testar a Maldição do Backlog.
const backlog: JogoSteam[] = Array.from({ length: 25 }, (_, i) => ({
  appid: 900000 + i,
  nome: `Jogo Comprado na Promoção ${i + 1}`,
  horas: 0,
  generos: ["Indie"],
  conquistasTotal: 10,
  conquistasFeitas: 0,
  conquistasRaras: [],
}));

// Segundo perfil, diferente do primeiro, para a tela de comparação.
// Tem jogos com mais de um gênero (as horas se dividem) e um backlog grande.
export const perfilFalsoMago: PerfilSteam = {
  steamId: "76561190000000002",
  nome: "Estrategista Falso",
  jogos: [
    {
      appid: 1158310,
      nome: "Crusader Kings III",
      horas: 400,
      generos: ["Strategy", "Simulation"],
      conquistasTotal: 50,
      conquistasFeitas: 12,
      conquistasRaras: ["Fim da Linhagem"],
    },
    {
      appid: 413150,
      nome: "Stardew Valley",
      horas: 150,
      generos: ["Indie", "RPG", "Simulation"],
      conquistasTotal: 40,
      conquistasFeitas: 40,
      conquistasRaras: [],
    },
    {
      appid: 620,
      nome: "Portal 2",
      horas: 25,
      generos: ["Action", "Adventure"],
      conquistasTotal: 51,
      conquistasFeitas: 30,
      conquistasRaras: [],
    },
    ...backlog,
  ],
};

export const perfisFalsos: PerfilSteam[] = [perfilFalso, perfilFalsoMago];
