import { ParlamentarItem } from '../models/contrato.model';
import { estaEmMandatoNoMomento } from './status-parlamentar';

export function ordenarParlamentares(
  itens?: ParlamentarItem[],
  dataIso?: string,
): ParlamentarItem[] {
  if (!itens || !Array.isArray(itens)) return [];
  return [...itens].sort((a, b) => {
    const aEmMandato = estaEmMandatoNoMomento(a, dataIso);
    const bEmMandato = estaEmMandatoNoMomento(b, dataIso);
    if (aEmMandato && !bEmMandato) return -1;
    if (!aEmMandato && bEmMandato) return 1;
    return (b.votos ?? 0) - (a.votos ?? 0);
  });
}
