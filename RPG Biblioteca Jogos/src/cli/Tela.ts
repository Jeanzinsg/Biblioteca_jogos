import type { ResultadoAtaque, ResultadoBatalha, ResumoDeAmigo } from "../contratos.ts";
import { NOMES_DOS_ATRIBUTOS, ROTULOS_DOS_ATRIBUTOS } from "../dominio/atributos.ts";
import type { Personagem } from "../dominio/Personagem.ts";

export class Tela {
  static readonly LARGURA = 50;

  static titulo(texto: string): string {
    const linha = "=".repeat(Tela.LARGURA);
    return `\n${linha}\n  ${texto}\n${linha}`;
  }

  static boasVindas(usandoDadosFalsos: boolean): string {
    const modo = usandoDadosFalsos
      ? "Modo de teste: usando perfis falsos (coloque STEAM_API_KEY no .env para usar a Steam de verdade)."
      : "Conectado à Steam: use o seu Steam ID, o link do seu perfil ou o seu nome de URL personalizada.";
    return `${Tela.titulo("STEAM RPG: sua biblioteca vira um herói")}\n${modo}`;
  }

  static menu(personagem: Personagem | undefined): string {
    const quemEstaJogando =
      personagem === undefined ? "Nenhum perfil carregado." : `Jogando com: ${Tela.resumo(personagem)}`;
    return [
      "",
      quemEstaJogando,
      "1. Carregar meu perfil",
      "2. Ver minha ficha",
      "3. Batalhar contra um amigo",
      "0. Sair",
    ].join("\n");
  }

  static resumo(personagem: Personagem): string {
    return `${personagem.nome}, ${personagem.classe()} nível ${personagem.nivel}`;
  }

  static listaDePerfis(titulo: string, perfis: ResumoDeAmigo[]): string {
    if (perfis.length === 0) {
      return `\n${titulo}: nenhum encontrado.`;
    }
    const linhas = perfis.map((perfil, i) => `  ${i + 1}. ${perfil.nome} (${perfil.steamId})`);
    return [`\n${titulo}:`, ...linhas].join("\n");
  }

  static ficha(personagem: Personagem): string {
    const base = personagem.atributosBase;
    const final = personagem.atributos;
    const linhas = [
      Tela.titulo(`${personagem.nome}: ${personagem.classe()} nível ${personagem.nivel}`),
      `Vida: ${personagem.vidaMaxima}   Ataque: ${personagem.habilidade()}`,
      `Esquiva: ${Tela.porcentagem(personagem.chanceDeEsquiva)}   Resistência: ${Tela.porcentagem(personagem.resistencia)}   Crítico: ${Tela.porcentagem(personagem.chanceDeCritico)}`,
      "",
    ];

    for (const atributo of NOMES_DOS_ATRIBUTOS) {
      const diferenca = final[atributo] - base[atributo];
      const ajuste = diferenca === 0 ? "" : ` (${diferenca > 0 ? "+" : ""}${diferenca})`;
      const rotulo = ROTULOS_DOS_ATRIBUTOS[atributo].padEnd(13);
      const valor = String(final[atributo]).padStart(3);
      linhas.push(`${rotulo}${valor} ${Tela.barra(final[atributo])}${ajuste}`);
    }

    const reliquias = personagem.reliquias();
    linhas.push("", `Relíquias (${reliquias.length}):`);
    linhas.push(...Tela.itens(reliquias.map((reliquia) => `${reliquia.nome}: ${reliquia.descricao()}`)));

    const titulos = personagem.titulos;
    linhas.push("", `Títulos (${titulos.length}):`);
    linhas.push(...Tela.itens(titulos.map((titulo) => titulo.descricao())));

    const maldicao = personagem.maldicao();
    if (maldicao !== undefined) {
      linhas.push("", `${maldicao.nome}: ${maldicao.descricao()}`);
    }
    return linhas.join("\n");
  }

  static ataque(ataque: ResultadoAtaque): string {
    const golpes = ataque.golpes.map((golpe) => {
      if (!golpe.acertou) {
        return "errou";
      }
      return golpe.critico ? `${golpe.dano} CRÍTICO!` : `${golpe.dano}`;
    });
    const final = ataque.alvoDerrotado ? `${ataque.alvo} caiu!` : `${ataque.alvo} ficou com ${ataque.vidaRestanteDoAlvo} de vida`;
    return `${ataque.atacante} usou ${ataque.habilidade} [${golpes.join(", ")}] -> ${final}`;
  }

  static batalha(resultado: ResultadoBatalha): string {
    const linhas = [Tela.titulo("BATALHA"), ...resultado.ataques.map((ataque) => Tela.ataque(ataque)), ""];
    linhas.push(
      resultado.vencedor === undefined
        ? "Empate! Ninguém aguentou derrubar o outro."
        : `${resultado.vencedor} venceu em ${resultado.ataques.length} ataques!`,
    );
    return linhas.join("\n");
  }

  static erro(erro: unknown): string {
    if (erro instanceof Error) {
      return `\n[!] ${erro.message}`;
    }
    return "\n[!] Algo deu errado.";
  }

  private static itens(textos: string[]): string[] {
    if (textos.length === 0) {
      return ["  (nenhuma)"];
    }
    return textos.map((texto) => `  - ${texto}`);
  }

  private static barra(valor: number): string {
    return "#".repeat(Math.round(valor / 5));
  }

  private static porcentagem(valor: number): string {
    return `${Math.round(valor * 100)}%`;
  }
}
