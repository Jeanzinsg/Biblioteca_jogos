import { randomUUID } from "crypto";
import { Formato, StatusJogo } from "../enums/enums.ts";
import { Avaliavel } from "../interfaces/Avaliavel.ts";
import { Pesquisavel } from "../interfaces/Pesquisavel.ts";
import { Colecao, Identificavel } from "../colecao/colecao.ts";
import { DadosInvalidosError } from "../erros/Erros.ts";
import { Review } from "./Review.ts";
import { Progresso } from "./progresso.ts";

export interface DadosJogo {
  id?: string;
  nome: string;
  plataforma: string;
  lojaOrigem: string;
  genero: string;
  dataLancamento: string;       // AAAA-MM-DD
  valorPago: number;
  duracaoEstimadaHoras: number; // usado pelo sorteador
  status?: StatusJogo;
}

export abstract class Jogo implements Identificavel, Avaliavel, Pesquisavel {
  readonly id: string;
  nome: string;
  plataforma: string;
  lojaOrigem: string;
  genero: string;
  dataLancamento: string;
  valorPago: number;
  duracaoEstimadaHoras: number;
  status: StatusJogo;
  progresso: Progresso = { horasJogadas: 0, percentualConclusao: 0 };
  readonly reviews = new Colecao<Review>(); // composição: reviews pertencem ao jogo

  constructor(dados: DadosJogo) {
    if (!dados.nome || !dados.nome.trim()) {
      throw new DadosInvalidosError("O nome do jogo nao pode ser vazio.");
    }
    if (dados.valorPago < 0) {
      throw new DadosInvalidosError("O valor pago nao pode ser negativo.");
    }
    if (isNaN(Date.parse(dados.dataLancamento))) {
      throw new DadosInvalidosError(`Data de lancamento invalida: "${dados.dataLancamento}". Use AAAA-MM-DD.`);
    }
    if (dados.duracaoEstimadaHoras < 0) {
      throw new DadosInvalidosError("A duracao estimada nao pode ser negativa.");
    }

    this.id = dados.id ?? randomUUID();
    this.nome = dados.nome.trim();
    this.plataforma = dados.plataforma;
    this.lojaOrigem = dados.lojaOrigem;
    this.genero = dados.genero;
    this.dataLancamento = dados.dataLancamento;
    this.valorPago = dados.valorPago;
    this.duracaoEstimadaHoras = dados.duracaoEstimadaHoras;
    this.status = dados.status ?? StatusJogo.BACKLOG;
  }

  // ---- Abstrações (cada subclasse implementa) ----
  abstract get formato(): Formato;
  abstract exibirDetalhes(): string; // método polimórfico

  // ---- Getters derivados ----
  get anoLancamento(): number {
    return new Date(this.dataLancamento).getFullYear();
  }

  get horasRestantesEstimadas(): number {
    const fracaoRestante = 1 - this.progresso.percentualConclusao / 100;
    return Math.max(0, this.duracaoEstimadaHoras * fracaoRestante);
  }

  // ---- Progresso ----
  registrarProgresso(horas: number, percentual: number, dataInicio?: string, dataTermino?: string): void {
    if (horas < 0) throw new DadosInvalidosError("Horas jogadas nao podem ser negativas.");
    if (percentual < 0 || percentual > 100) {
      throw new DadosInvalidosError("Percentual de conclusao deve estar entre 0 e 100.");
    }
    const progresso: Progresso = {
      horasJogadas: horas,
      percentualConclusao: percentual,
    };
    const inicio = dataInicio || this.progresso.dataInicio;
    const termino = dataTermino || this.progresso.dataTermino;
    if (inicio !== undefined) progresso.dataInicio = inicio;
    if (termino !== undefined) progresso.dataTermino = termino;
    this.progresso = progresso;
    // Atualização automática de status
    if (percentual === 100) {
      this.status = StatusJogo.ZERADO;
    } else if (percentual > 0 && (this.status === StatusJogo.BACKLOG || this.status === StatusJogo.WISHLIST)) {
      this.status = StatusJogo.JOGANDO;
    }
  }

  // ---- Interface Avaliavel ----
  adicionarReview(review: Review): void {
    this.reviews.adicionar(review);
  }

  obterNotaGeral(): number | null {
    const lista = this.reviews.listar();
    if (lista.length === 0) return null;
    const soma = lista.reduce((acc, r) => acc + r.notaGeral(), 0);
    return soma / lista.length;
  }

  // ---- Interface Pesquisavel ----
  corresponde(termo: string): boolean {
    const t = termo.toLowerCase();
    return [this.nome, this.plataforma, this.genero, this.lojaOrigem].some((campo) =>
      campo.toLowerCase().includes(t)
    );
  }

  // ---- Auxiliares de exibição ----
  protected detalhesBase(): string {
    const nota = this.obterNotaGeral();
    return [
      `Nome:            ${this.nome}`,
      `Plataforma:      ${this.plataforma}`,
      `Formato:         ${this.formato}`,
      `Loja de origem:  ${this.lojaOrigem}`,
      `Genero:          ${this.genero}`,
      `Lancamento:      ${this.dataLancamento} (${this.anoLancamento})`,
      `Valor pago:      R$ ${this.valorPago.toFixed(2)}`,
      `Duracao estim.:  ${this.duracaoEstimadaHoras} h`,
      `Status:          ${this.status}`,
      `Horas jogadas:   ${this.progresso.horasJogadas} h`,
      `Conclusao:       ${this.progresso.percentualConclusao}%`,
      `Inicio/Termino:  ${this.progresso.dataInicio ?? "-"} / ${this.progresso.dataTermino ?? "-"}`,
      `Nota geral:      ${nota === null ? "sem reviews" : nota.toFixed(1)}`,
    ].join("\n");
  }

  resumoLinha(): string {
    const nota = this.obterNotaGeral();
    const notaTxt = nota === null ? " - " : nota.toFixed(1);
    return `${this.nome.padEnd(30)} | ${this.plataforma.padEnd(12)} | ${this.formato.padEnd(8)} | ${this.status.padEnd(11)} | ${String(this.progresso.horasJogadas).padStart(5)} h | nota ${notaTxt}`;
  }
}
