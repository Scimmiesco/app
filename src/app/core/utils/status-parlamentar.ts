import { ParlamentarItem } from '../models/contrato.model';
import { formatarDataIso } from './formatadores';

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
