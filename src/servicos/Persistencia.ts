import * as fs from "fs";
import * as path from "path";
import { Colecao } from "../colecao/colecao.ts";
import { StatusJogo } from "../enums/enums.ts";
import { PersistenciaError } from "../erros/Erros.ts";
import { Jogo } from "../modelos/Jogo.ts";
import { JogoDigital } from "../modelos/JogoDigital.ts";
import { JogoFisico } from "../modelos/JogoFisico.ts";
import { Notas } from "../modelos/Notas.ts";
import { Progresso } from "../modelos/progresso.ts";
import { Review } from "../modelos/Review.ts";

// ---- Formato dos dados no JSON (DTOs) ----
interface ReviewDTO {
  id: string;
  data: string;
  texto: string;
  contemSpoiler: boolean;
  notas: { jogabilidade: number; historia: number; trilhaSonora: number; graficos: number };
}

interface JogoDTO {
  tipo: "fisico" | "digital";
  id: string;
  nome: string;
  plataforma: string;
  lojaOrigem: string;
  genero: string;
  dataLancamento: string;
  valorPago: number;
  duracaoEstimadaHoras: number;
  status: StatusJogo;
  progresso: Progresso;
  reviews: ReviewDTO[];
  // exclusivos das subclasses
  localGuarda?: string;
  espacoGB?: number;
  launcher?: string;
}

export class Persistencia {
  constructor(private readonly caminhoArquivo: string = path.join(process.cwd(), "dados", "colecao.json")) {}

  salvar(colecao: Colecao<Jogo>): void {
    try {
      const dtos = colecao.listar().map((j) => Persistencia.paraDTO(j));
      fs.mkdirSync(path.dirname(this.caminhoArquivo), { recursive: true });
      fs.writeFileSync(this.caminhoArquivo, JSON.stringify(dtos, null, 2), "utf-8");
    } catch (e) {
      throw new PersistenciaError(`falha ao salvar em ${this.caminhoArquivo}: ${(e as Error).message}`);
    }
  }

  carregar(): Colecao<Jogo> {
    const colecao = new Colecao<Jogo>();
    if (!fs.existsSync(this.caminhoArquivo)) return colecao; // primeira execução

    try {
      const conteudo = fs.readFileSync(this.caminhoArquivo, "utf-8");
      const dtos = JSON.parse(conteudo) as JogoDTO[];
      for (const dto of dtos) colecao.adicionar(Persistencia.deDTO(dto));
      return colecao;
    } catch (e) {
      throw new PersistenciaError(`falha ao ler ${this.caminhoArquivo}: ${(e as Error).message}`);
    }
  }

  get caminho(): string {
    return this.caminhoArquivo;
  }

  // ---- Conversões ----
  private static paraDTO(jogo: Jogo): JogoDTO {
    const base: JogoDTO = {
      tipo: jogo instanceof JogoFisico ? "fisico" : "digital",
      id: jogo.id,
      nome: jogo.nome,
      plataforma: jogo.plataforma,
      lojaOrigem: jogo.lojaOrigem,
      genero: jogo.genero,
      dataLancamento: jogo.dataLancamento,
      valorPago: jogo.valorPago,
      duracaoEstimadaHoras: jogo.duracaoEstimadaHoras,
      status: jogo.status,
      progresso: jogo.progresso,
      reviews: jogo.reviews.listar().map((r) => ({
        id: r.id,
        data: r.data,
        texto: r.texto,
        contemSpoiler: r.contemSpoiler,
        notas: {
          jogabilidade: r.notas.jogabilidade,
          historia: r.notas.historia,
          trilhaSonora: r.notas.trilhaSonora,
          graficos: r.notas.graficos,
        },
      })),
    };

    if (jogo instanceof JogoFisico) base.localGuarda = jogo.localGuarda;
    if (jogo instanceof JogoDigital) {
      base.espacoGB = jogo.espacoGB;
      base.launcher = jogo.launcher;
    }
    return base;
  }

  private static deDTO(dto: JogoDTO): Jogo {
    const dados = {
      id: dto.id,
      nome: dto.nome,
      plataforma: dto.plataforma,
      lojaOrigem: dto.lojaOrigem,
      genero: dto.genero,
      dataLancamento: dto.dataLancamento,
      valorPago: dto.valorPago,
      duracaoEstimadaHoras: dto.duracaoEstimadaHoras,
      status: dto.status,
    };

    const jogo: Jogo =
      dto.tipo === "fisico"
        ? new JogoFisico(dados, dto.localGuarda ?? "")
        : new JogoDigital(dados, dto.espacoGB ?? 0, dto.launcher ?? "");

    jogo.progresso = dto.progresso;

    for (const r of dto.reviews ?? []) {
      const notas = new Notas(r.notas.jogabilidade, r.notas.historia, r.notas.trilhaSonora, r.notas.graficos);
      jogo.adicionarReview(new Review(r.texto, notas, r.contemSpoiler, r.id, r.data));
    }
    return jogo;
  }
}
