import { ParlamentarItem } from '../models/contrato.model';
import { formatarStatus } from './formatadores';

export type ContextoTagParlamentar =
  'governador' | 'senador' | 'deputado-federal' | 'deputado-estadual' | 'vereador';

export interface TagParlamentar {
  texto: string;
  classe: string;
  testId: string | null;
}

function criarTag(texto: string, classe: string, testId: string | null = null): TagParlamentar {
  return { texto, classe, testId };
}

export function resolverTagParlamentar(
  parlamentar: ParlamentarItem,
  contexto: ContextoTagParlamentar,
): TagParlamentar | null {
  const status = parlamentar.status_eleicao_2026;
  const situacao = parlamentar.situacao;
  const situacaoEleito = situacao === 'ELEITO' || (situacao?.startsWith('ELEITO') ?? false);

  switch (contexto) {
    case 'governador':
      if (status === 'reeleito') return criarTag('reeleito', 'tag-reeleito');
      if (status === 'eleito' || situacaoEleito) return criarTag('eleito', 'tag-eleito');
      if (status) return criarTag(formatarStatus(status), 'tag-neutral');
      return null;

    case 'senador':
      if (status === 'reeleito') return criarTag('reeleito', 'tag-reeleito');
      if (status === 'eleito') return criarTag('eleito', 'tag-eleito');
      if (status === 'em_exercicio') return criarTag('em exercício', 'tag-em-exercicio');
      if (status) return criarTag(formatarStatus(status), 'tag-neutral');
      return null;

    case 'deputado-federal':
      if (status === 'reeleito') return criarTag('reeleito', 'tag-reeleito');
      if (status === 'eleito') return criarTag('eleito', 'tag-eleito');
      if (status === 'nao_reeleito') return criarTag('não reeleito', 'tag-nao-reeleito');
      if (status === 'nao_concorreu_ao_cargo') {
        return criarTag('Não concorreu ao cargo', 'tag-nao-concorreu', 'badge-nao-concorreu');
      }
      if (status) return criarTag(formatarStatus(status), 'tag-neutral');
      return null;

    case 'deputado-estadual':
    case 'vereador':
      if (status === 'reeleito') return criarTag('reeleito', 'tag-reeleito');
      if (status === 'eleito' || situacaoEleito) return criarTag('eleito', 'tag-eleito');
      if (status) return criarTag(formatarStatus(status), 'tag-neutral');
      return null;
  }
}
