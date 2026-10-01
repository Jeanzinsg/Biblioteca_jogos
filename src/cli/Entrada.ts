import * as readline from "readline-sync";
import { DadosInvalidosError } from "../erros/Erros.ts";

export function lerTexto(rotulo: string, padrao?: string): string {
  const sufixo = padrao !== undefined ? ` [${padrao}]` : "";
  const resposta = readline.question(`${rotulo}${sufixo}: `).trim();
  if (resposta === "" && padrao !== undefined) return padrao;
  return resposta;
}

export function lerNumero(rotulo: string, padrao?: number): number {
  const texto = lerTexto(rotulo, padrao !== undefined ? String(padrao) : undefined);
  const n = Number(texto.replace(",", "."));
  if (isNaN(n)) throw new DadosInvalidosError(`"${texto}" não é um número.`);
  return n;
}

export function lerBooleano(rotulo: string, padrao = false): boolean {
  return readline.keyInYNStrict(`${rotulo}`) ?? padrao;
}

/** Mostra opções numeradas e devolve a escolhida (ou o padrão se Enter). */
export function lerOpcao<T extends string>(rotulo: string, opcoes: readonly T[], padrao?: T): T {
  console.log(rotulo);
  opcoes.forEach((o, i) => console.log(`  ${i + 1}) ${o}`));
  const texto = lerTexto("Escolha", padrao !== undefined ? String(opcoes.indexOf(padrao) + 1) : undefined);
  const indice = Number(texto) - 1;
  if (isNaN(indice) || indice < 0 || indice >= opcoes.length) {
    throw new DadosInvalidosError(`opção "${texto}" inválida.`);
  }
  return opcoes[indice]!;
}

export function pausar(): void {
  readline.question("\nPressione Enter para continuar...");
}
