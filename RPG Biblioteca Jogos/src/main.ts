import PromptSync from "prompt-sync";
import { Batalha } from "./Batalha.ts";
import type { FonteDePerfis, PerfilSteam } from "./contratos.ts";
import { Gerador } from "./Gerador.ts";
import type { Personagem } from "./personagens/Personagem.ts";
import { FonteFalsa } from "./steam/FonteFalsa.ts";
import { SteamService } from "./steam/SteamService.ts";

const prompt = PromptSync({ sigint: true });
const chave = process.env.STEAM_API_KEY?.trim() ?? "";
const fonte: FonteDePerfis = chave !== "" ? new SteamService(chave) : new FonteFalsa();
const gerador = new Gerador();

let grupo: PerfilSteam[] = [];

function perguntarId(): string {
  if (fonte instanceof FonteFalsa) {
    console.log(`Perfis de teste: ${fonte.idsDisponiveis().join(", ")}`);
  }
  return prompt("Steam ID: ") ?? "";
}

function montarHerois(): Personagem[] {
  const herois: Personagem[] = [];
  for (const perfil of grupo) {
    herois.push(gerador.criarHeroi(perfil));
  }
  return herois;
}

function mostrarGrupo(): void {
  if (grupo.length === 0) {
    throw new Error("O grupo está vazio. Escolha o seu perfil primeiro (opção 1).");
  }
  console.log("\n--- SEU GRUPO ---");
  for (const heroi of montarHerois()) {
    console.log(heroi.ficha());
  }
}

async function escolherMeuPerfil(): Promise<void> {
  const perfil = await fonte.buscarPerfil(perguntarId());
  grupo = [perfil];
  const chefe = gerador.criarChefe(perfil);
  mostrarGrupo();
  console.log(`\nO seu backlog acordou: ${chefe.tamanho} jogos nunca abertos, ${chefe.vida} de vida.`);
}

async function chamarAmigo(): Promise<void> {
  if (grupo.length === 0) {
    throw new Error("Escolha o seu perfil antes de chamar amigos.");
  }
  if (grupo.length >= Batalha.TAMANHO_MAXIMO_DO_GRUPO) {
    throw new Error("O grupo já está cheio.");
  }
  const amigo = await fonte.buscarPerfil(perguntarId());
  if (grupo.some((perfil) => perfil.steamId === amigo.steamId)) {
    throw new Error(`${amigo.nome} já está no grupo.`);
  }
  grupo.push(amigo);
  console.log(`\n${amigo.nome} entrou no grupo!`);
}

function enfrentarChefe(): void {
  const dono = grupo[0];
  if (dono === undefined) {
    throw new Error("Escolha o seu perfil primeiro (opção 1).");
  }
  const chefe = gerador.criarChefe(dono);
  const batalha = new Batalha(montarHerois(), chefe);

  console.log(`\n=== ${chefe.nome.toUpperCase()} (${chefe.tamanho} jogos parados) ===`);
  while (!batalha.acabou()) {
    for (const linha of batalha.jogarRodada()) {
      console.log(linha);
    }
    console.log(`Rodada ${batalha.rodada}: ${batalha.placar()}`);
    prompt("(Enter para continuar)");
  }

  if (batalha.heroisVenceram()) {
    console.log("\nBACKLOG ZERADO! Agora vai jogar aqueles jogos de verdade.");
  } else {
    console.log("\nO backlog venceu... e amanhã tem promoção nova. Chame mais amigos!");
  }
}

console.log("=========================================");
console.log("  STEAM RPG: A REVOLTA DO BACKLOG");
console.log("=========================================");
console.log("Os jogos que você comprou e nunca abriu viraram um monstro.");
console.log("As horas que você jogou viraram o seu herói. Chame amigos e lute!");
if (fonte instanceof FonteFalsa) {
  console.log("(Modo de teste: coloque STEAM_API_KEY no .env para usar a Steam de verdade.)");
}

let opcao = "";
while (opcao !== "0") {
  console.log("\n1. Escolher meu perfil");
  console.log("2. Chamar um amigo para o grupo");
  console.log("3. Ver o grupo");
  console.log("4. Enfrentar o Chefe do Backlog");
  console.log("0. Sair");
  opcao = prompt("Opção: ") ?? "0";

  try {
    switch (opcao) {
      case "1":
        await escolherMeuPerfil();
        break;
      case "2":
        await chamarAmigo();
        break;
      case "3":
        mostrarGrupo();
        break;
      case "4":
        enfrentarChefe();
        break;
      case "0":
        console.log("Até a próxima promoção!");
        break;
      default:
        console.log("Opção inválida.");
    }
  } catch (erro) {
    console.log(`\n[!] ${erro instanceof Error ? erro.message : "Algo deu errado."}`);
  }
}
