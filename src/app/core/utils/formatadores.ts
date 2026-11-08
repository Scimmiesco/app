export const CORES_PARTIDOS: Record<string, string> = {
  PT: '#a0001c',
  PDT: '#9e0b13',
  PCdoB: '#8b0000',
  PSOL: '#a50021',
  CIDADANIA: '#b00010',
  PL: '#003da5',
  UNIÃO: '#003b7a',
  UNIAO: '#003b7a',
  PP: '#00508f',
  PSDB: '#004a85',
  PSD: '#004e8c',
  REPUBLICANOS: '#0a2e6e',
  PODE: '#005580',
  DC: '#004b87',
  MDB: '#005a34',
  PV: '#005a34',
  REDE: '#00574b',
  NOVO: '#b84a00',
  AVANTE: '#c2410c',
  SOLIDARIEDADE: '#b94700',
  PSB: '#b45309',
  PROS: '#c2410c',
};

const FORMATADOR_NUMERO = new Intl.NumberFormat('pt-BR');
const FORMATADOR_MOEDA = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
const FORMATADOR_PCT = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const FORMATADOR_INDICE = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const FORMATADOR_NOTA = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const FORMATADOR_DESVIO_DECIMAL = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const FORMATADOR_DATA = new Intl.DateTimeFormat('pt-BR');

export function formatarNumero(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  return FORMATADOR_NUMERO.format(val);
}

export function formatarIndice(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  return FORMATADOR_INDICE.format(val);
}

export function formatarNota(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  return FORMATADOR_NOTA.format(val);
}

export function formatarDesvio(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  const limpo = Object.is(val, -0) || Math.abs(val) < 0.00001 ? 0 : val;
  const sinal = limpo > 0 ? '+' : '';
  return sinal + FORMATADOR_DESVIO_DECIMAL.format(limpo);
}

export function formatarDesvioPct(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  const limpo = Object.is(val, -0) || Math.abs(val) < 0.00001 ? 0 : val;
  const sinal = limpo > 0 ? '+' : '';
  return sinal + FORMATADOR_DESVIO_DECIMAL.format(limpo) + '%';
}

export function formatarMoeda(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  return FORMATADOR_MOEDA.format(val).replace(/\s/g, '\u00A0');
}

export function formatarPct(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  return FORMATADOR_PCT.format(val) + '%';
}

export function formatarVariacaoVotos(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  const sinal = val > 0 ? '+' : '';
  return sinal + formatarNumero(val);
}

export function formatarVariacaoPct(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  const sinal = val > 0 ? '+' : '';
  return sinal + FORMATADOR_PCT.format(val) + ' p.p.';
}

export function formatarDataIso(isoStr?: string | null): string {
  if (!isoStr) return '—';
  try {
    const partes = isoStr.split('-');
    if (partes.length === 3) {
      const ano = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1;
      const dia = parseInt(partes[2], 10);
      const data = new Date(ano, mes, dia);
      return FORMATADOR_DATA.format(data);
    }
  } catch {
    // mantém o valor original como fallback
  }
  return isoStr;
}

export function formatarStatus(status?: string | null): string {
  if (!status) return '—';
  const s = status.trim().toLowerCase();
  switch (s) {
    case 'em_exercicio':
      return 'em exercício';
    case 'nao_reeleito':
      return 'não reeleito';
    case 'nao_concorreu_ao_cargo':
      return 'não concorreu ao cargo';
    case 'reeleito':
      return 'reeleito';
    case 'eleito':
      return 'eleito';
    default:
      return status.replace(/_/g, ' ');
  }
}

export function getNumero(cand?: { numero?: string | number | null } | null): string | null {
  if (!cand || cand.numero === undefined || cand.numero === null) return null;
  const num = String(cand.numero).trim();
  return num ? num : null;
}

export function getNumeroHistorico(
  cand?: {
    numero_historico?: {
      numero: string | number;
      ano: number;
      cargo: string;
      fonte: string;
    } | null;
  } | null,
): { numero: string | number; ano: number; cargo: string; fonte: string } | null {
  if (!cand || !cand.numero_historico || !cand.numero_historico.numero) return null;
  return cand.numero_historico;
}

export function getNumeroPrefixo(numero?: string | number | null): string {
  if (!numero) return '';
  const str = String(numero).trim();
  return str.slice(0, 2);
}

export function getNumeroResto(numero?: string | number | null): string {
  if (!numero) return '';
  const str = String(numero).trim();
  return str.slice(2);
}

export function getCorPartido(sigla?: string | null): string {
  if (!sigla) return '#000000';
  const s = sigla.trim().toUpperCase();
  return CORES_PARTIDOS[s] || '#000000';
}

export const NOMES_ESTADOS: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

export function formatarEstado(uf?: string | null): string {
  if (!uf) return '—';
  const limpo = uf.trim();
  if (!limpo) return '—';
  const sigla = limpo.toUpperCase();
  return NOMES_ESTADOS[sigla] || limpo;
}
