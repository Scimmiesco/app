import { ParlamentarItem } from '../models/contrato.model';

export function ordenarParlamentares(itens?: ParlamentarItem[]): ParlamentarItem[] {
  if (!itens || !Array.isArray(itens)) return [];
  return [...itens].sort((a, b) => {
    if (a.em_exercicio && !b.em_exercicio) return -1;
    if (!a.em_exercicio && b.em_exercicio) return 1;
    return (b.votos ?? 0) - (a.votos ?? 0);
  });
}
