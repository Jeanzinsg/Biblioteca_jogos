import { perfisFalsos } from "./dados-falsos/perfilFalso.ts";

// Ponto de entrada. Na fase de integração, liga SteamService, CalculadoraDeAtributos,
// Personagem e CLI. Por enquanto só mostra que os dados falsos carregam.
for (const perfil of perfisFalsos) {
  const horas = perfil.jogos.reduce((total, jogo) => total + jogo.horas, 0);
  console.log(`${perfil.nome}: ${perfil.jogos.length} jogos, ${horas}h no total`);
}
