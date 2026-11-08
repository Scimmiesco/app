import { signal, Signal } from '@angular/core';
import { ParlamentarItem } from '../models/contrato.model';
import { formatarDataIso } from './formatadores';

/**
 * Datas conhecidas de início e término de mandatos constitucionais no Brasil (YYYY-MM-DD).
 * Como já se sabe de antemão exatamente quando os mandatos mudam, o aplicativo não precisa
 * fazer polling contínuo nem consultar `new Date()` a cada ciclo de renderização.
 */
export const DATAS_TRANSICAO_MANDATO: readonly string[] = [
  '2027-01-01', // Posse Executivo Federal/Estadual (2027-2030) e término do mandato 2023-2026 (2026-12-31)
  '2027-02-01', // Posse Legislativo Federal/Estadual (2027-2031/2035) e término de 2019-2027 / 2023-2027 (2027-01-31)
  '2029-01-01', // Término do mandato Municipal 2025-2028 (2028-12-31)
  '2031-01-01', // Término do mandato Executivo Federal/Estadual 2027-2030 (2030-12-31)
  '2031-02-01', // Término da legislatura Câmara/Assembleias/Senado 2027-2031 (2031-01-31)
  '2035-02-01', // Término do mandato Senatorial 2027-2035 (2035-01-31)
];

const MAX_TIMEOUT_MS = 2_147_483_647; // Limite de 32 bits do setTimeout (~24,8 dias)

export function obterDataLocalIso(data: Date = new Date()): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function proximaDataTransicaoMandato(dataIsoAtual: string): string | null {
  for (const dataTransicao of DATAS_TRANSICAO_MANDATO) {
    if (dataTransicao > dataIsoAtual) {
      return dataTransicao;
    }
  }
  return null;
}

function converterDataIsoParaTimestampMeiaNoite(dataIso: string): number {
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  return new Date(ano, mes - 1, dia, 0, 0, 0, 0).getTime();
}

const dataReferenciaInterna = signal<string>(obterDataLocalIso());
let timestampProximaTransicao: number | null = null;
let timerTransicao: ReturnType<typeof setTimeout> | null = null;
let listenerVisibilidadeRegistrado = false;

function agendarProximaTransicaoMandato(dataIsoBase: string): void {
  if (timerTransicao !== null) {
    clearTimeout(timerTransicao);
    timerTransicao = null;
  }

  const proximaIso = proximaDataTransicaoMandato(dataIsoBase);
  if (!proximaIso) {
    timestampProximaTransicao = null;
    return;
  }

  timestampProximaTransicao = converterDataIsoParaTimestampMeiaNoite(proximaIso);
  const restanteMs = timestampProximaTransicao - Date.now();

  if (restanteMs > 0 && restanteMs <= MAX_TIMEOUT_MS) {
    timerTransicao = setTimeout(() => {
      const novaDataIso = obterDataLocalIso();
      dataReferenciaInterna.set(novaDataIso);
      agendarProximaTransicaoMandato(novaDataIso);
    }, restanteMs);
    (timerTransicao as unknown as { unref?: () => void })?.unref?.();
  }

  if (
    !listenerVisibilidadeRegistrado &&
    typeof document !== 'undefined' &&
    typeof document.addEventListener === 'function'
  ) {
    listenerVisibilidadeRegistrado = true;
    document.addEventListener(
      'visibilitychange',
      () => {
        if (
          document.visibilityState === 'visible' &&
          timestampProximaTransicao !== null &&
          Date.now() >= timestampProximaTransicao
        ) {
          const novaDataIso = obterDataLocalIso();
          dataReferenciaInterna.set(novaDataIso);
          agendarProximaTransicaoMandato(novaDataIso);
        }
      },
      { passive: true },
    );
  }
}

agendarProximaTransicaoMandato(dataReferenciaInterna());

/**
 * Signal somente-leitura com a data ISO de referência para avaliação de mandatos.
 * Só sofre atualização quando uma data real de transição de mandato é atingida.
 */
export const dataReferenciaMandato: Signal<string> = dataReferenciaInterna.asReadonly();

/**
 * Permite sobrescrever a data de referência em testes (ou restaurar a data atual passando null).
 */
export function definirDataReferenciaMandato(dataIso: string | null): void {
  const efetiva = dataIso ?? obterDataLocalIso();
  dataReferenciaInterna.set(efetiva);
  if (dataIso === null) {
    agendarProximaTransicaoMandato(efetiva);
  } else if (timerTransicao !== null) {
    clearTimeout(timerTransicao);
    timerTransicao = null;
  }
}

const cacheMandatoParlamentar = new WeakMap<ParlamentarItem, { dataIso: string; ativo: boolean }>();

/**
 * Verifica se um intervalo [mandatoInicio, mandatoFim] está em vigor na data de referência.
 */
export function estaEmMandatoIntervalo(
  mandatoInicio: string,
  mandatoFim: string,
  dataIso?: string,
): boolean {
  const refIso = dataIso ?? dataReferenciaInterna();
  return refIso >= mandatoInicio && refIso <= mandatoFim;
}

/**
 * Avalia dinamicamente se o parlamentar/candidato está exercendo o mandato no momento
 * (data de referência atual), usando memoização O(1) por objeto (`WeakMap`) para evitar
 * reprocessamento em renderizações ou interações de UI.
 */
export function estaEmMandatoNoMomento(parlamentar: ParlamentarItem, dataIso?: string): boolean {
  const refIso = dataIso ?? dataReferenciaInterna();
  const emCache = cacheMandatoParlamentar.get(parlamentar);
  if (emCache && emCache.dataIso === refIso) {
    return emCache.ativo;
  }

  const inicio = (parlamentar.mandato_inicio || '').trim();
  const fim = (parlamentar.mandato_fim || '').trim();

  let ativo = false;
  if (fim && refIso > fim) {
    ativo = false;
  } else if (parlamentar.em_exercicio) {
    ativo = parlamentar.status_eleicao_2026 === 'reeleito' || !inicio || refIso >= inicio;
  } else if (inicio) {
    ativo = refIso >= inicio;
  }

  cacheMandatoParlamentar.set(parlamentar, { dataIso: refIso, ativo });
  return ativo;
}

export type SituacaoParlamentar =
  | 'eleito'
  | 'reeleito'
  | 'nao_reeleito'
  | 'suplente'
  | 'outro_cargo'
  | 'nao_concorreu'
  | 'em_exercicio'
  | 'outro';

export interface TagParlamentar {
  situacao: SituacaoParlamentar;
  texto: string;
  classe: string;
  descricao: string;
  testId: string | null;
}

function criarTag(
  situacao: SituacaoParlamentar,
  texto: string,
  classe: string,
  descricao: string,
  testId: string | null = null,
): TagParlamentar {
  return { situacao, texto, classe, descricao, testId };
}

/**
 * Fonte única da situação exibida no selo sob a foto.
 * A mesma regra vale para todas as seções; o que muda é apenas o dado oficial.
 */
export function resolverTagParlamentar(
  parlamentar: ParlamentarItem,
  anoPleito = 2026,
): TagParlamentar | null {
  const status = parlamentar.status_eleicao_2026;
  const situacao = parlamentar.situacao;
  const situacaoNormalizada = (situacao || '').trim();
  const situacaoEleito =
    situacaoNormalizada === 'ELEITO' || situacaoNormalizada.startsWith('ELEITO');
  const situacaoSuplente = situacaoNormalizada === 'SUPLENTE';

  const detalheTse =
    situacaoNormalizada && situacaoNormalizada.toLowerCase() !== 'em exercício'
      ? ' · TSE: ' + situacaoNormalizada
      : '';
  const detalheMandato = parlamentar.mandato_fim
    ? ' Mandato até ' + formatarDataIso(parlamentar.mandato_fim) + '.'
    : '';

  if (situacaoSuplente) {
    return criarTag(
      'suplente',
      'suplente',
      'tag-suplente',
      'Disputou o pleito de ' +
        anoPleito +
        ' e ficou como suplente' +
        detalheTse +
        '.' +
        detalheMandato,
    );
  }

  if (status === 'reeleito') {
    return criarTag(
      'reeleito',
      'reeleito',
      'tag-reeleito',
      'Reeleito no pleito de ' + anoPleito + detalheTse + '.' + detalheMandato,
    );
  }

  if (status === 'eleito') {
    return criarTag(
      'eleito',
      'eleito',
      'tag-eleito',
      'Eleito no pleito de ' + anoPleito + detalheTse + '.' + detalheMandato,
    );
  }

  if (status === 'nao_reeleito') {
    return criarTag(
      'nao_reeleito',
      'não reeleito',
      'tag-nao-reeleito',
      'Disputou o pleito de ' + anoPleito + ' e não foi eleito' + detalheTse + '.' + detalheMandato,
    );
  }

  if (status === 'nao_concorreu_ao_cargo') {
    const disputouOutroCargo =
      Boolean(parlamentar.cargo_2026) || parlamentar.concorreu_2026 === true;
    if (disputouOutroCargo) {
      const sitOutro = (parlamentar.situacao_2026_outro || '').trim().toUpperCase();
      const resultadoOutro = sitOutro.startsWith('ELEITO')
        ? ' (eleito · TSE: ' + parlamentar.situacao_2026_outro + ')'
        : ' (não eleito)';
      const nomeOutroCargo = parlamentar.cargo_2026 || 'outro cargo';
      return criarTag(
        'outro_cargo',
        'outro cargo',
        'tag-nao-concorreu',
        'Concorreu a ' +
          nomeOutroCargo +
          ' no pleito de ' +
          anoPleito +
          resultadoOutro +
          '.' +
          detalheMandato,
        'badge-nao-concorreu',
      );
    }

    return criarTag(
      'nao_concorreu',
      'não concorreu',
      'tag-nao-concorreu',
      'Não disputou este cargo no pleito de ' + anoPleito + '.' + detalheMandato,
      'badge-nao-concorreu',
    );
  }

  if (status === 'em_exercicio') {
    return criarTag(
      'em_exercicio',
      'em exercício',
      'tag-em-exercicio',
      'Mandato em exercício' + detalheTse + '.' + detalheMandato,
    );
  }

  if (situacaoEleito) {
    return criarTag(
      'eleito',
      'eleito',
      'tag-eleito',
      'Eleito no pleito de ' + anoPleito + detalheTse + '.',
    );
  }

  if (status) {
    return criarTag(
      'outro',
      status.replace(/_/g, ' '),
      'tag-neutral',
      'Situação eleitoral: ' + status.replace(/_/g, ' ') + '.',
    );
  }

  return null;
}

/**
 * Indica se o parlamentar/candidato tentou eleição no pleito e não se elegeu
 * (não reeleito, suplente ou concorreu a outro cargo sem se eleger).
 */
export function tentouENaoSeElegeu(parlamentar: ParlamentarItem): boolean {
  const status = parlamentar.status_eleicao_2026;
  const situacaoNormalizada = (parlamentar.situacao || '').trim().toUpperCase();

  if (status === 'nao_reeleito') {
    return true;
  }

  if (
    situacaoNormalizada === 'SUPLENTE' ||
    situacaoNormalizada === 'NÃO ELEITO' ||
    situacaoNormalizada === 'NAO ELEITO'
  ) {
    return true;
  }

  if (status === 'nao_concorreu_ao_cargo' && parlamentar.concorreu_2026 === true) {
    const sitOutro = (parlamentar.situacao_2026_outro || '').trim().toUpperCase();
    return !sitOutro.startsWith('ELEITO');
  }

  return false;
}
