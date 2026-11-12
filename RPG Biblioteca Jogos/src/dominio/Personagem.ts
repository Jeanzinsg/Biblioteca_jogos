import type { Atributos, Golpe, NomeClasse, ResultadoAtaque, Sorteio } from "../contratos.ts";
import { NOMES_DOS_ATRIBUTOS } from "./atributos.ts";
import { Efeito } from "./Efeito.ts";
import { MaldicaoDoBacklog } from "./MaldicaoDoBacklog.ts";
import { Reliquia } from "./Reliquia.ts";
import { Titulo } from "./Titulo.ts";

export abstract class Personagem {
  static readonly VIDA_BASE = 100;
  static readonly VIDA_POR_NIVEL = 5;
  static readonly ESQUIVA_MAXIMA = 0.3;
  static readonly RESISTENCIA_MAXIMA = 0.5;
  static readonly CRITICO_MAXIMO = 0.5;

  private readonly _efeitos: Efeito[] = [];
  private readonly _titulos: Titulo[] = [];
  private _vidaAtual: number;

  constructor(
    private readonly _nome: string,
    private readonly _nivel: number,
    private readonly _atributosBase: Atributos,
  ) {
    if (_nome.trim().length === 0) {
      throw new Error("O personagem precisa de um nome.");
    }
    if (!Number.isInteger(_nivel) || _nivel < 1) {
      throw new Error("O nível precisa ser um número inteiro maior ou igual a 1.");
    }
    for (const atributo of NOMES_DOS_ATRIBUTOS) {
      if (_atributosBase[atributo] < 0) {
        throw new Error("Os atributos não podem ser negativos.");
      }
    }
    this._atributosBase = { ..._atributosBase };
    this._vidaAtual = this.vidaMaxima;
  }

  abstract classe(): NomeClasse;

  abstract habilidade(): string;

  abstract atacar(alvo: Personagem, sorteio: Sorteio): ResultadoAtaque;

  get nome(): string {
    return this._nome;
  }

  get nivel(): number {
    return this._nivel;
  }

  get atributosBase(): Atributos {
    return { ...this._atributosBase };
  }

  get atributos(): Atributos {
    let atributos = this.atributosBase;
    for (const efeito of this._efeitos) {
      atributos = efeito.aplicar(atributos);
    }
    return atributos;
  }

  get efeitos(): Efeito[] {
    return [...this._efeitos];
  }

  get titulos(): Titulo[] {
    return [...this._titulos];
  }

  get vidaAtual(): number {
    return this._vidaAtual;
  }

  get vidaMaxima(): number {
    return Personagem.VIDA_BASE + this._nivel * Personagem.VIDA_POR_NIVEL + this.atributos.forca;
  }

  get chanceDeEsquiva(): number {
    return Math.min(Personagem.ESQUIVA_MAXIMA, this.atributos.agilidade / 300);
  }

  get resistencia(): number {
    return Math.min(Personagem.RESISTENCIA_MAXIMA, this.atributos.sabedoria / 200);
  }

  get chanceDeCritico(): number {
    return Math.min(Personagem.CRITICO_MAXIMO, this.atributos.sorte / 200);
  }

  reliquias(): Reliquia[] {
    const reliquias: Reliquia[] = [];
    for (const efeito of this._efeitos) {
      if (efeito instanceof Reliquia) {
        reliquias.push(efeito);
      }
    }
    return reliquias;
  }

  maldicao(): MaldicaoDoBacklog | undefined {
    for (const efeito of this._efeitos) {
      if (efeito instanceof MaldicaoDoBacklog) {
        return efeito;
      }
    }
    return undefined;
  }

  adicionarEfeito(efeito: Efeito): void {
    if (efeito instanceof MaldicaoDoBacklog && this.maldicao() !== undefined) {
      throw new Error(`${this._nome} já está sob a Maldição do Backlog.`);
    }
    this._efeitos.push(efeito);
    this._vidaAtual = Math.min(this._vidaAtual, this.vidaMaxima);
  }

  adicionarTitulo(titulo: Titulo): void {
    this._titulos.push(titulo);
  }

  estaVivo(): boolean {
    return this._vidaAtual > 0;
  }

  restaurarVida(): void {
    this._vidaAtual = this.vidaMaxima;
  }

  tentarEsquivar(sorteio: Sorteio): boolean {
    return sorteio() < this.chanceDeEsquiva;
  }

  receberDano(dano: number): number {
    if (dano < 0) {
      throw new Error("O dano não pode ser negativo.");
    }
    if (!this.estaVivo()) {
      throw new Error(`${this._nome} já foi derrotado.`);
    }
    const danoReal = Math.round(dano * (1 - this.resistencia));
    this._vidaAtual = Math.max(0, this._vidaAtual - danoReal);
    return danoReal;
  }

  protected golpear(alvo: Personagem, danoBase: number, sorteio: Sorteio, podeSerEsquivado: boolean): Golpe {
    if (!this.estaVivo()) {
      throw new Error(`${this._nome} foi derrotado e não pode atacar.`);
    }
    if (podeSerEsquivado && alvo.tentarEsquivar(sorteio)) {
      return { acertou: false, critico: false, dano: 0 };
    }
    const critico = sorteio() < this.chanceDeCritico;
    const dano = alvo.receberDano(critico ? danoBase * 2 : danoBase);
    return { acertou: true, critico, dano };
  }

  protected resultado(alvo: Personagem, golpes: Golpe[]): ResultadoAtaque {
    let danoTotal = 0;
    for (const golpe of golpes) {
      danoTotal += golpe.dano;
    }
    return {
      atacante: this._nome,
      alvo: alvo.nome,
      habilidade: this.habilidade(),
      golpes,
      danoTotal,
      vidaRestanteDoAlvo: alvo.vidaAtual,
      alvoDerrotado: !alvo.estaVivo(),
    };
  }
}
