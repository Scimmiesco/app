import { ParlamentarItem } from '../models/contrato.model';
import { resolverTagParlamentar } from './status-parlamentar';

function criar(over: Partial<ParlamentarItem>): ParlamentarItem {
  return {
    nome: 'NOME',
    nome_urna: 'NOME',
    partido: 'PT',
    em_exercicio: true,
    mandato_fim: '2031-01-31',
    status_eleicao_2026: 'eleito',
    ...over,
  };
}

describe('resolverTagParlamentar', () => {
  it('should map governor tags including reeleito and ELEITO situation', () => {
    expect(
      resolverTagParlamentar(criar({ status_eleicao_2026: 'reeleito' }), 'governador')?.classe,
    ).toBe('tag-reeleito');
    expect(
      resolverTagParlamentar(criar({ status_eleicao_2026: 'eleito' }), 'governador')?.texto,
    ).toBe('eleito');
    expect(
      resolverTagParlamentar(
        criar({ status_eleicao_2026: 'em_exercicio', situacao: 'ELEITO' }),
        'governador',
      )?.classe,
    ).toBe('tag-eleito');
  });

  it('should map senator tags including em exercício', () => {
    expect(
      resolverTagParlamentar(criar({ status_eleicao_2026: 'em_exercicio' }), 'senador')?.texto,
    ).toBe('em exercício');
    expect(
      resolverTagParlamentar(criar({ status_eleicao_2026: 'nao_reeleito' }), 'senador'),
    ).toEqual({
      texto: 'não reeleito',
      classe: 'tag-neutral',
      testId: null,
    });
  });

  it('should distinguish not reelected from did not run for federal deputy', () => {
    expect(
      resolverTagParlamentar(criar({ status_eleicao_2026: 'nao_reeleito' }), 'deputado-federal')
        ?.classe,
    ).toBe('tag-nao-reeleito');
    expect(
      resolverTagParlamentar(
        criar({ status_eleicao_2026: 'nao_concorreu_ao_cargo' }),
        'deputado-federal',
      ),
    ).toEqual({
      texto: 'Não concorreu ao cargo',
      classe: 'tag-nao-concorreu',
      testId: 'badge-nao-concorreu',
    });
  });

  it('should accept ELEITO situation for state deputies and councilors', () => {
    expect(
      resolverTagParlamentar(
        criar({ status_eleicao_2026: 'eleito', situacao: 'ELEITO POR QP' }),
        'deputado-estadual',
      )?.classe,
    ).toBe('tag-eleito');
    expect(
      resolverTagParlamentar(
        criar({ status_eleicao_2026: 'eleito', situacao: 'ELEITO POR QP' }),
        'vereador',
      )?.classe,
    ).toBe('tag-eleito');
  });

  it('should return null when the candidate has no election status', () => {
    expect(
      resolverTagParlamentar(criar({ status_eleicao_2026: '' }), 'deputado-federal'),
    ).toBeNull();
  });
});
