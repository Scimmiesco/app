import { EleicaoPresidencialDados, SecaoEnvelope } from '../models/contrato.model';

export interface ComparativoPresidencial {
  t1: EleicaoPresidencialDados;
  t2: EleicaoPresidencialDados;
  compAbs1: number;
  compAbs2: number;
  difLulaVotos: number;
  difLulaPct: number;
  difFlavioVotos: number;
  difFlavioPct: number;
  difOutrosVotos: number;
  difOutrosPct: number;
  difValidos: number;
  difComparecimento: number;
  difComparecimentoAbs: number;
}

export function calcularComparativoPresidencial(
  secao1t?: SecaoEnvelope<EleicaoPresidencialDados>,
  secao2t?: SecaoEnvelope<EleicaoPresidencialDados>,
): ComparativoPresidencial | null {
  const t1 = secao1t?.dados;
  const t2 = secao2t?.dados;
  if (!t1 || !t2) return null;

  const outros1t = t1.outros ?? 0;
  const outros2t = t2.outros ?? 0;
  const pctOutros1t = Math.max(0, 100 - (t1.pct_lula + t1.pct_flavio));
  const pctOutros2t = Math.max(0, 100 - (t2.pct_lula + t2.pct_flavio));

  const compAbs1 =
    t1.comparecimento_abs ?? Math.round((t1.comparecimento_pct / 100) * t1.eleitores_aptos);
  const compAbs2 =
    t2.comparecimento_abs ?? Math.round((t2.comparecimento_pct / 100) * t2.eleitores_aptos);

  return {
    t1,
    t2,
    compAbs1,
    compAbs2,
    difLulaVotos: t2.lula - t1.lula,
    difLulaPct: t2.pct_lula - t1.pct_lula,
    difFlavioVotos: t2.flavio - t1.flavio,
    difFlavioPct: t2.pct_flavio - t1.pct_flavio,
    difOutrosVotos: outros2t - outros1t,
    difOutrosPct: pctOutros2t - pctOutros1t,
    difValidos: t2.validos - t1.validos,
    difComparecimento: t2.comparecimento_pct - t1.comparecimento_pct,
    difComparecimentoAbs: compAbs2 - compAbs1,
  };
}
