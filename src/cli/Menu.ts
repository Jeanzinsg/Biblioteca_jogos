import { Colecao } from "../colecao/colecao.ts";
import { Formato, StatusJogo } from "../enums/enums.ts";
import { ErroColecao, JogoNaoEncontradoError } from "../erros/Erros.ts";
import { DadosJogo, Jogo } from "../modelos/Jogo.ts";
import { JogoDigital } from "../modelos/JogoDigital.ts";
import { JogoFisico } from "../modelos/JogoFisico.ts";
import { Notas } from "../modelos/Notas.ts";
import { Review } from "../modelos/Review.ts";
import { Estatisticas } from "../servicos/Estatisticas.ts";
import { Filtros, Ordenacao } from "../servicos/Filtros.ts";
import { Persistencia } from "../servicos/Persistencia.ts";
import { Sorteador } from "../servicos/Sorteador.ts";
import { lerBooleano, lerNumero, lerOpcao, lerTexto, pausar } from "./Entrada.ts";

const STATUS = Object.values(StatusJogo);
const FORMATOS = Object.values(Formato);

export class Menu {
  private colecao: Colecao<Jogo>;
  private readonly persistencia = new Persistencia();

  constructor() {
    try {
      this.colecao = this.persistencia.carregar();
      console.log(`Colecao carregada: ${this.colecao.tamanho} jogo(s).`);
    } catch (e) {
      console.log((e as Error).message);
      this.colecao = new Colecao<Jogo>();
    }
  }

  // ================= LOOP PRINCIPAL =================
  executar(): void {
    while (true) {
      this.exibirMenu();
      const opcao = lerTexto("Opcao");
      console.log();
      try {
        switch (opcao) {
          case "1": this.cadastrarJogo(); break;
          case "2": this.listarBiblioteca(); break;
          case "3": this.verDetalhes(); break;
          case "4": this.editarJogo(); break;
          case "5": this.removerJogo(); break;
          case "6": this.registrarProgresso(); break;
          case "7": this.adicionarReview(); break;
          case "8": this.verReviews(); break;
          case "9": this.estatisticas(); break;
          case "10": this.filtrar(); break;
          case "11": this.ordenar(); break;
          case "12": this.oQueJogarAgora(); break;
          case "13": this.salvar(); break;
          case "14": this.carregar(); break;
          case "0":
            this.salvar();
            console.log("Ate a proxima!");
            process.exit(0);
          default:
            console.log("Opcao invalida.");
        }
      } catch (e) {
        if (e instanceof ErroColecao) {
          console.log(`⚠ ${e.name}: ${e.message}`);
        } else {
          console.log(`Erro inesperado: ${(e as Error).message}`);
        }
      }
      pausar();
    }
  }

  private exibirMenu(): void {
    console.log(`
======== GERENCIADOR DE JOGOS (${this.colecao.tamanho} na coleção) ========
 1) Cadastrar jogo            8) Ver reviews de um jogo
 2) Listar biblioteca         9) Estatísticas
 3) Ver detalhes de um jogo  10) Filtrar jogos
 4) Editar jogo              11) Ordenar lista
 5) Remover jogo             12) O que jogar agora?
 6) Registrar progresso      13) Salvar em JSON
 7) Adicionar review         14) Recarregar do JSON
 0) Salvar e sair
`);
  }

  // ================= 1. GESTÃO DA COLEÇÃO =================
  private lerDadosJogo(atual?: Jogo): DadosJogo {
    const dados: DadosJogo = {
      nome: lerTexto("Nome", atual?.nome),
      plataforma: lerTexto("Plataforma (ex.: PS5, Switch, PC)", atual?.plataforma),
      lojaOrigem: lerTexto("Loja de origem", atual?.lojaOrigem),
      genero: lerTexto("Genero", atual?.genero),
      dataLancamento: lerTexto("Data de lancamento (AAAA-MM-DD)", atual?.dataLancamento),
      valorPago: lerNumero("Valor pago (R$)", atual?.valorPago),
      duracaoEstimadaHoras: lerNumero("Duracao estimada (horas)", atual?.duracaoEstimadaHoras),
      status: lerOpcao("Status:", STATUS, atual?.status ?? StatusJogo.BACKLOG),
    };
    if (atual?.id !== undefined) dados.id = atual.id;
    return dados;
  }

  private cadastrarJogo(): void {
    console.log("--- Cadastro de jogo ---");
    const formato = lerOpcao("Formato:", FORMATOS);
    const dados = this.lerDadosJogo();

    const jogo: Jogo =
      formato === Formato.FISICO
        ? new JogoFisico(dados, lerTexto("Prateleira / local de guarda"))
        : new JogoDigital(dados, lerNumero("Espaco em GB"), lerTexto("Loja/launcher (ex.: Steam)"));

    this.colecao.adicionar(jogo);
    console.log(`✔ "${jogo.nome}" cadastrado.`);
  }

  private listarBiblioteca(lista: Jogo[] = this.colecao.listar()): void {
    if (lista.length === 0) {
      console.log("Nenhum jogo para exibir.");
      return;
    }
    console.log(`#   | ${"Nome".padEnd(30)} | ${"Plataforma".padEnd(12)} | Formato  | Status      | Horas   | Nota`);
    console.log("-".repeat(100));
    lista.forEach((j, i) => console.log(`${String(i + 1).padStart(3)} | ${j.resumoLinha()}`));
  }

  /** Lista os jogos e pede ao usuário que escolha um pelo número. */
  private escolherJogo(lista: Jogo[] = this.colecao.listar()): Jogo {
    if (lista.length === 0) throw new JogoNaoEncontradoError("coleção vazia");
    this.listarBiblioteca(lista);
    const n = lerNumero("Numero do jogo");
    const jogo = lista[n - 1];
    if (!jogo) throw new JogoNaoEncontradoError(`posicao ${n}`);
    return jogo;
  }

  private verDetalhes(): void {
    const jogo = this.escolherJogo();
    console.log("\n" + jogo.exibirDetalhes()); // polimorfismo em ação
  }

  private editarJogo(): void {
    const antigo = this.escolherJogo();
    console.log("Pressione Enter para manter o valor atual.\n");
    const dados = this.lerDadosJogo(antigo);

    let novo: Jogo;
    if (antigo instanceof JogoFisico) {
      novo = new JogoFisico(dados, lerTexto("Local de guarda", antigo.localGuarda));
    } else if (antigo instanceof JogoDigital) {
      novo = new JogoDigital(dados, lerNumero("Espaço em GB", antigo.espacoGB), lerTexto("Launcher", antigo.launcher));
    } else {
      throw new JogoNaoEncontradoError(antigo.id);
    }

    // preserva progresso e reviews
    novo.progresso = antigo.progresso;
    antigo.reviews.listar().forEach((r) => novo.adicionarReview(r));

    this.colecao.adicionar(novo); // mesmo id → substitui
    console.log(`✔ "${novo.nome}" atualizado.`);
  }

  private removerJogo(): void {
    const jogo = this.escolherJogo();
    if (lerBooleano(`Remover "${jogo.nome}"?`)) {
      this.colecao.remover(jogo.id);
      console.log("✔ Removido.");
    }
  }

  private registrarProgresso(): void {
    const jogo = this.escolherJogo();
    const horas = lerNumero("Horas jogadas", jogo.progresso.horasJogadas);
    const pct = lerNumero("% de conclusao", jogo.progresso.percentualConclusao);
    const inicio = lerTexto("Data de inicio (AAAA-MM-DD, vazio p/ manter)", jogo.progresso.dataInicio ?? "");
    const termino = lerTexto("Data de termino (AAAA-MM-DD, vazio p/ manter)", jogo.progresso.dataTermino ?? "");
    jogo.registrarProgresso(horas, pct, inicio || undefined, termino || undefined);
    console.log(`✔ Progresso salvo. Status atual: ${jogo.status}`);
  }

  // ================= 3. REVIEWS =================
  private adicionarReview(): void {
    const jogo = this.escolherJogo();
    console.log("Notas de 0 a 10:");
    const notas = new Notas(
      lerNumero("Jogabilidade"),
      lerNumero("Historia"),
      lerNumero("Trilha sonora"),
      lerNumero("Graficos/desempenho")
    );
    const texto = lerTexto("Texto da review");
    const spoiler = lerBooleano("Contém spoiler?");
    const review = new Review(texto, notas, spoiler);
    jogo.adicionarReview(review);
    console.log(`✔ Review adicionada. Nota geral: ${review.notaGeral().toFixed(1)}`);
  }

  private verReviews(): void {
    const jogo = this.escolherJogo();
    const reviews = jogo.reviews.listar();
    if (reviews.length === 0) {
      console.log("Este jogo ainda nao tem reviews.");
      return;
    }
    const revelar = reviews.some((r) => r.contemSpoiler) ? lerBooleano("Revelar spoilers?") : false;
    reviews.forEach((r, i) => console.log(`\n--- Review ${i + 1} ---\n${r.exibir(revelar)}`));
    console.log(`\nMedia do jogo: ${jogo.obterNotaGeral()!.toFixed(1)}`);
  }

  // ================= 4. ESTATÍSTICAS =================
  private estatisticas(): void {
    const est = new Estatisticas(this.colecao.listar());
    console.log("--- Estatísticas da coleção ---");
    console.log(`Taxa de conclusao:     ${est.taxaConclusao().toFixed(1)}%`);
    console.log(`Genero mais frequente: ${est.generoMaisFrequente() ?? "-"}`);
    console.log(`Total de horas:        ${est.totalHorasJogadas()} h`);
    console.log(`Total investido:       R$ ${est.totalInvestido().toFixed(2)}`);
    console.log("\nDistribuicao por plataforma:");
    console.log(est.tabelaDistribuicaoPorPlataforma());

    if (lerBooleano("\nCalcular custo por hora de um jogo?")) {
      const jogo = this.escolherJogo();
      console.log(`Custo por hora de "${jogo.nome}": R$ ${est.custoPorHora(jogo).toFixed(2)}/h`);
    }
  }

  // ================= 5. RECURSOS INTELIGENTES =================
  private filtrar(): void {
    const filtros = new Filtros(this.colecao.listar());
    const tipo = lerOpcao("Filtrar por:", ["Console/plataforma", "Nota minima", "Genero", "Status", "Ano", "Termo livre"] as const);

    let resultado: Jogo[];
    switch (tipo) {
      case "Console/plataforma": resultado = filtros.porConsole(lerTexto("Plataforma")); break;
      case "Nota minima":        resultado = filtros.porNotaMinima(lerNumero("Nota minima (0-10)")); break;
      case "Genero":             resultado = filtros.porGenero(lerTexto("Genero")); break;
      case "Status":             resultado = filtros.porStatus(lerOpcao("Status:", STATUS)); break;
      case "Ano":                resultado = filtros.porAno(lerNumero("Ano de lancamento")); break;
      case "Termo livre":        resultado = filtros.porTermo(lerTexto("Termo")); break;
    }
    console.log(`\n${resultado.length} resultado(s):`);
    this.listarBiblioteca(resultado);
  }

  private ordenar(): void {
    const criterio = lerOpcao("Ordenar por:", ["Nota", "Ano", "Horas jogadas"] as const);
    const jogos = this.colecao.listar();
    let ordenados: Jogo[];
    switch (criterio) {
      case "Nota":          ordenados = Ordenacao.porNota(jogos); break;
      case "Ano":           ordenados = Ordenacao.porAno(jogos, lerBooleano("Do mais novo para o mais antigo?")); break;
      case "Horas jogadas": ordenados = Ordenacao.porHorasJogadas(jogos); break;
    }
    console.log();
    this.listarBiblioteca(ordenados);
  }

  private oQueJogarAgora(): void {
    const tempo = lerNumero("Quantas horas você tem disponiveis?");
    const jogo = new Sorteador(this.colecao.listar()).oQueJogarAgora(tempo);
    if (!jogo) {
      console.log("Seu backlog esta vazio — hora de comprar algo novo (ou nao).");
      return;
    }
    console.log(`\n🎮 Sugestao: ${jogo.nome} (${jogo.plataforma})`);
    console.log(`   Faltam ~${jogo.horasRestantesEstimadas.toFixed(1)} h para terminar. Status: ${jogo.status}`);
  }

  // ================= 6. PERSISTÊNCIA =================
  private salvar(): void {
    this.persistencia.salvar(this.colecao);
    console.log(`✔ Colecao salva em ${this.persistencia.caminho}`);
  }

  private carregar(): void {
    this.colecao = this.persistencia.carregar();
    console.log(`✔ ${this.colecao.tamanho} jogo(s) carregado(s).`);
  }
}
