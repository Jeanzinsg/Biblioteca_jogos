import PromptSync from "prompt-sync";
import { Tela } from "./cli/Tela.ts";
import type { PerfilSteam, ResumoDeAmigo } from "./contratos.ts";
import type { Personagem } from "./dominio/Personagem.ts";
import { Batalha } from "./regras/Batalha.ts";
import { GeradorDePersonagem } from "./regras/GeradorDePersonagem.ts";
import { PerfilPrivadoError } from "./steam/erros.ts";
import type { FonteDePerfis } from "./steam/FonteDePerfis.ts";
import { FonteFalsa } from "./steam/FonteFalsa.ts";
import { SteamService } from "./steam/SteamService.ts";

const prompt = PromptSync({ sigint: true });
const chave = process.env.STEAM_API_KEY?.trim() ?? "";
const fonte: FonteDePerfis = chave.length > 0 ? new SteamService(chave) : new FonteFalsa();
const gerador = new GeradorDePersonagem();

let meuPerfil: PerfilSteam | undefined;
let meuPersonagem: Personagem | undefined;

function ler(pergunta: string): string | undefined {
  const resposta = prompt(pergunta) as string | null;
  return resposta === null ? undefined : resposta.trim();
}

function escolherDaLista(lista: ResumoDeAmigo[], entrada: string): string {
  const numero = Number(entrada);
  const escolhido = Number.isInteger(numero) ? lista[numero - 1] : undefined;
  return escolhido === undefined ? entrada : escolhido.steamId;
}

async function carregarMeuPerfil(): Promise<void> {
  let sugestoes: ResumoDeAmigo[] = [];
  if (fonte instanceof FonteFalsa) {
    sugestoes = fonte.perfisDisponiveis();
    console.log(Tela.listaDePerfis("Perfis de teste", sugestoes));
  }
  const entrada = ler("Número da lista ou Steam ID: ") ?? "";

  console.log("\nLendo a biblioteca...");
  const perfil = await fonte.buscarPerfil(escolherDaLista(sugestoes, entrada));
  meuPerfil = perfil;
  meuPersonagem = gerador.gerar(perfil);
  console.log(Tela.ficha(meuPersonagem));
}

async function batalhar(): Promise<void> {
  if (meuPerfil === undefined || meuPersonagem === undefined) {
    console.log("\nCarregue o seu perfil primeiro (opção 1).");
    return;
  }

  let amigos: ResumoDeAmigo[] = [];
  try {
    amigos = await fonte.listarAmigos(meuPerfil.steamId);
  } catch (erro) {
    if (!(erro instanceof PerfilPrivadoError)) {
      throw erro;
    }
    console.log(Tela.erro(erro));
  }
  const primeiros = amigos.slice(0, 20);
  console.log(Tela.listaDePerfis("Amigos", primeiros));

  const entrada = ler("Número do amigo, Steam ID ou link do perfil: ") ?? "";
  console.log("\nLendo a biblioteca do oponente...");
  const perfilDoOponente = await fonte.buscarPerfil(escolherDaLista(primeiros, entrada));
  const oponente = gerador.gerar(perfilDoOponente);
  console.log(Tela.ficha(oponente));

  const resultado = new Batalha(meuPersonagem, oponente).lutar();
  console.log(Tela.batalha(resultado));
}

console.log(Tela.boasVindas(fonte instanceof FonteFalsa));

let opcao: string | undefined = "";
while (opcao !== "0") {
  console.log(Tela.menu(meuPersonagem));
  opcao = ler("Escolha uma opção: ") ?? "0";

  try {
    switch (opcao) {
      case "1":
        await carregarMeuPerfil();
        break;
      case "2":
        console.log(meuPersonagem === undefined ? "\nCarregue o seu perfil primeiro (opção 1)." : Tela.ficha(meuPersonagem));
        break;
      case "3":
        await batalhar();
        break;
      case "0":
        console.log("\nAté a próxima aventura!");
        break;
      default:
        console.log("\nOpção inválida.");
    }
  } catch (erro) {
    console.log(Tela.erro(erro));
  }
}
