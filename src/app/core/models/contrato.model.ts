export type StatusDado = 'oficial' | 'curado' | 'pendente';

export interface FonteMeta {
  orgao: string;
  titulo: string;
  url: string;
  consultado_em: string;
  confianca: StatusDado;
}

export interface CoordenadasBbox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export interface CoordenadasMunicipio {
  latitude: number;
  longitude: number;
  zoom: number;
  bbox: CoordenadasBbox;
}

export interface MunicipioMeta {
  codigo_ibge: number;
  codigo_tse: string;
  nome: string;
  uf: string;
  geo?: CoordenadasMunicipio;
}

export type FaixaBenchmark = 'muito_abaixo' | 'abaixo' | 'proximo' | 'acima' | 'muito_acima';

export interface EducacaoItemBenchmark {
  valor: number;
  desvio_mediana: number;
  desvio_pct_mediana?: number;
  fator_mediana?: number;
  percentil: number;
  z_robusto?: number;
  faixa: FaixaBenchmark | string;
  faixa_rotulo: string;
  n: number;
  min?: number;
  max?: number;
  media?: number;
  mediana: number;
  q1?: number;
  q3?: number;
  p10?: number;
  p90?: number;
  mad?: number;
  ano?: number;
  fonte?: string;
  fonte_titulo?: string;
}

export interface EducacaoBenchmarkMeta {
  indicador: string;
  ano?: number;
  universo: string;
  ponderacao: string;
  metodo?: Record<string, string>;
  aviso?: string;
}

export interface EducacaoBenchmark {
  meta: EducacaoBenchmarkMeta;
  comparacoes: {
    anos_iniciais?: Record<string, EducacaoItemBenchmark>;
    anos_finais?: Record<string, EducacaoItemBenchmark>;
    [etapa: string]: Record<string, EducacaoItemBenchmark> | undefined;
  };
}

export interface EscolarizacaoBenchmark {
  meta?: EducacaoBenchmarkMeta;
  comparacao?: EducacaoItemBenchmark;
}

export interface EconomiaBenchmark {
  meta?: EducacaoBenchmarkMeta;
  comparacoes?: {
    pib_total?: EducacaoItemBenchmark;
    pib_per_capita?: EducacaoItemBenchmark;
    renda_media_pc?: EducacaoItemBenchmark;
    renda_mediana_pc?: EducacaoItemBenchmark;
    receita_bruta?: EducacaoItemBenchmark;
    despesa_bruta?: EducacaoItemBenchmark;
    [chave: string]: EducacaoItemBenchmark | undefined;
  };
}

export interface SecaoEnvelope<
  T,
  B = EducacaoBenchmark | EscolarizacaoBenchmark | EducacaoItemBenchmark | EconomiaBenchmark,
> {
  titulo: string;
  categoria?: string;
  status: StatusDado;
  fonte: string;
  ano: number;
  coletado_em: string;
  motivo: string | null;
  dados: T;
  pct_base?: string;
  mandato?: string;
  nota?: string;
  benchmark?: B;
}

export interface PendenciaItem {
  secao: string;
  motivo: string;
  previsto?: string;
}

export interface CabecalhoDados {
  nome: string;
  uf: string;
  populacao: number;
}

export interface ResumoIbgeDados {
  populacao?: number;
  renda_media_pc: number;
  renda_mediana_pc: number;
  pct_urbana: number;
  cor_raca_pct: Record<string, number>;
  area_territorial_km2?: number;
  densidade_hab_km2?: number;
}

export interface ResumoEconomiaDados {
  pib_total: number;
  pib_per_capita: number;
}

export interface ResumoPopulacaoEstimadaDados {
  populacao_estimada: number;
}

export interface ResumoEscolarizacaoDados {
  faixa_6_14_pct: number;
}

export interface ResumoEducacaoDados {
  anos_iniciais: Record<string, number>;
  anos_finais: Record<string, number>;
}

export interface ResumoFinancasDados {
  receita_total?: number;
  transferencias_correntes?: number;
  iptu?: number;
  iss?: number;
  pct_transferencias_sobre_correntes?: number;
  receita_bruta?: number;
  despesa_bruta?: number;
}

export interface EleicaoPresidencialDados {
  eleitores_aptos: number;
  comparecimento_abs?: number;
  comparecimento_pct: number;
  validos: number;
  lula: number;
  flavio: number;
  outros: number;
  pct_lula: number;
  pct_flavio: number;
  locais: number;
  secoes: number;
  secoes_apuradas?: number;
  total_secoes?: number;
}

export interface NumeroHistorico {
  numero: string | number;
  ano: number;
  cargo: string;
  fonte: string;
}

export interface FotoCandidato {
  arquivo: string;
  fonte: string;
  url: string;
  credito: string;
  ano: number;
  sha256: string;
  largura: number;
  altura: number;
  licenca?: string;
}

export interface ParlamentarItem {
  nome: string;
  nome_urna: string;
  partido: string;
  numero?: string | number | null;
  numero_fonte?: string | null;
  numero_historico?: NumeroHistorico | null;
  foto?: FotoCandidato | null;
  votos?: number | null;
  pct?: number | null;
  situacao?: string | null;
  em_exercicio: boolean;
  mandato_inicio?: string;
  mandato_fim: string;
  status_eleicao_2026:
    'reeleito' | 'eleito' | 'nao_reeleito' | 'nao_concorreu_ao_cargo' | 'em_exercicio' | string;
  votos_nominais_mandato_atual?: number | null;
  motivo_sem_votos?: string | null;
  fonte?: string;
  fonte_votos_mandato?: string;
  url_perfil?: string;
  concorreu_2026?: boolean;
  cargo_2026?: string;
  votos_2026_outro?: number | null;
  pct_2026_outro?: number | null;
  situacao_2026_outro?: string | null;
}

export interface SecoesMunicipio {
  cabecalho?: SecaoEnvelope<CabecalhoDados>;
  resumo_ibge_censo?: SecaoEnvelope<ResumoIbgeDados>;
  resumo_economia?: SecaoEnvelope<ResumoEconomiaDados, EconomiaBenchmark>;
  resumo_populacao_estimada?: SecaoEnvelope<ResumoPopulacaoEstimadaDados>;
  resumo_escolarizacao?: SecaoEnvelope<
    ResumoEscolarizacaoDados,
    EducacaoItemBenchmark | EscolarizacaoBenchmark
  >;
  resumo_educacao?: SecaoEnvelope<ResumoEducacaoDados, EducacaoBenchmark>;
  resumo_financas?: SecaoEnvelope<ResumoFinancasDados, EconomiaBenchmark>;
  eleicao_2026_1t?: SecaoEnvelope<EleicaoPresidencialDados>;
  eleicao_2026_2t?: SecaoEnvelope<EleicaoPresidencialDados>;
  governador?: SecaoEnvelope<ParlamentarItem[]>;
  senadores?: SecaoEnvelope<ParlamentarItem[]>;
  deputados_federais?: SecaoEnvelope<ParlamentarItem[]>;
  deputados_estaduais?: SecaoEnvelope<ParlamentarItem[]>;
  prefeito?: SecaoEnvelope<ParlamentarItem[]>;
  vereadores?: SecaoEnvelope<ParlamentarItem[]>;
  [key: string]: SecaoEnvelope<unknown> | undefined;
}

export interface MapaFonteMeta {
  orgao: string;
  tipo: string;
  url: string;
  sha256: string;
  consultado_em: string;
}

export interface MapaMeta {
  svg: string;
  viewBox: string;
  largura: number;
  altura: number;
  fonte: MapaFonteMeta;
}

export interface MunicipioSnapshot {
  schema_version: string;
  gerado_em: string;
  municipio: MunicipioMeta;
  fontes: Record<string, FonteMeta>;
  mapa?: MapaMeta;
  secoes: SecoesMunicipio;
  pendencias: PendenciaItem[];
}

export interface CidadeItemIndice {
  codigo_ibge: number;
  codigo_tse: string;
  nome: string;
  uf: string;
  arquivo: string;
  disponivel: boolean;
}

export interface IndiceCidades {
  schema_version: string;
  gerado_em: string;
  cidades: CidadeItemIndice[];
}

export interface EstadoCabecalhoDados {
  nome: string;
  sigla: string;
  populacao: number;
  eleitorado: number;
  total_municipios: number;
  capital: string;
  regiao: string;
}

export interface EstadoMeta {
  codigo_uf: number;
  sigla: string;
  nome: string;
  regiao: string;
  capital: {
    nome: string;
    codigo_ibge: number;
  };
  total_municipios: number;
  populacao?: number;
  eleitorado_total?: number;
  area_km2?: number;
  densidade_hab_km2?: number;
  pib_total_milhoes?: number;
  geo?: CoordenadasMunicipio;
}

export interface MunicipioItemDestaque {
  codigo_ibge: number;
  nome: string;
  populacao?: number;
  eleitorado?: number;
  prefeito?: string;
  partido?: string;
  disponivel: boolean;
}

export interface SecoesEstado {
  cabecalho: SecaoEnvelope<EstadoCabecalhoDados>;
  governador: SecaoEnvelope<ParlamentarItem[]>;
  senadores: SecaoEnvelope<ParlamentarItem[]>;
  deputados_federais: SecaoEnvelope<ParlamentarItem[]>;
  deputados_estaduais: SecaoEnvelope<ParlamentarItem[]>;
  resumo_ibge?: SecaoEnvelope<ResumoIbgeDados>;
  resumo_educacao?: SecaoEnvelope<ResumoEducacaoDados>;
  resumo_economia?: SecaoEnvelope<ResumoEconomiaDados>;
  eleicao_2026_1t?: SecaoEnvelope<EleicaoPresidencialDados>;
  eleicao_2026_2t?: SecaoEnvelope<EleicaoPresidencialDados>;
  municipios?: SecaoEnvelope<MunicipioItemDestaque[]>;
}

export interface EstadoSnapshot {
  schema_version: string;
  gerado_em: string;
  estado: EstadoMeta;
  fontes: Record<string, FonteMeta>;
  mapa?: MapaMeta;
  secoes: SecoesEstado;
  pendencias?: PendenciaItem[];
}

export interface EstadoItemIndice {
  sigla: string;
  codigo_uf: number;
  nome: string;
  regiao: string;
  arquivo: string;
  disponivel: boolean;
}

export interface IndiceEstados {
  schema_version: string;
  gerado_em: string;
  estados: EstadoItemIndice[];
}
