import { Review } from "../modelos/Review.ts";

export interface Avaliavel {
  adicionarReview(review: Review): void;
  obterNotaGeral(): number | null;
}
