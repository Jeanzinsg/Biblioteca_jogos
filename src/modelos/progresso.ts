export interface Progresso {
  horasJogadas: number;
  percentualConclusao: number; // 0 a 100
  dataInicio?: string;         // AAAA-MM-DD
  dataTermino?: string;        // AAAA-MM-DD
}
