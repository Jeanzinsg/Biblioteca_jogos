export interface Identificavel {
  readonly id: string;
}

export class Colecao<T extends Identificavel> {
  private itens = new Map<string, T>();

  adicionar(item: T): void {
    this.itens.set(item.id, item);
  }

  remover(id: string): boolean {
    return this.itens.delete(id);
  }

  buscarPorId(id: string): T | undefined {
    return this.itens.get(id);
  }

  listar(): T[] {
    return [...this.itens.values()];
  }

  filtrar(predicado: (item: T) => boolean): T[] {
    return this.listar().filter(predicado);
  }

  ordenar(comparador: (a: T, b: T) => number): T[] {
    return this.listar().sort(comparador);
  }

  get tamanho(): number {
    return this.itens.size;
  }

  limpar(): void {
    this.itens.clear();
  }
}
