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
  it('should map reelected, elected and not reelected', () => {
    expect(resolverTagParlamentar(criar({ status_eleicao_2026: 'reeleito' }))?.texto).toBe(
      'reeleito',
    );
    expect(resolverTagParlamentar(criar({ status_eleicao_2026: 'eleito' }))?.texto).toBe('eleito');
    expect(resolverTagParlamentar(criar({ status_eleicao_2026: 'nao_reeleito' }))?.texto).toBe(
      'não reeleito',
    );
  });

  it('should distinguish suplente from nao reeleito using the official TSE situation', () => {
    const suplente = resolverTagParlamentar(
      criar({ status_eleicao_2026: 'nao_reeleito', situacao: 'SUPLENTE' }),
    );
    expect(suplente?.situacao).toBe('suplente');
    expect(suplente?.texto).toBe('suplente');
    expect(suplente?.classe).toBe('tag-suplente');
    expect(suplente?.descricao).toContain('ficou como suplente');
  });

  it('should explain when the candidate did not run for the office', () => {
    const tag = resolverTagParlamentar(
      criar({
        status_eleicao_2026: 'nao_concorreu_ao_cargo',
        cargo_2026: 'Senador',
        situacao: null,
      }),
    );
    expect(tag?.situacao).toBe('nao_concorreu');
    expect(tag?.texto).toBe('não concorreu');
    expect(tag?.testId).toBe('badge-nao-concorreu');
    expect(tag?.descricao).toContain('Senador');
  });

  it('should map current mandate without election as em exercício', () => {
    const tag = resolverTagParlamentar(
      criar({ status_eleicao_2026: 'em_exercicio', situacao: 'em exercício' }),
    );
    expect(tag?.situacao).toBe('em_exercicio');
    expect(tag?.texto).toBe('em exercício');
    expect(tag?.descricao).toContain('Mandato em exercício');
    expect(tag?.descricao).toContain('Mandato até 31/01/2031');
  });

  it('should keep the official TSE situation in the accessible description', () => {
    const tag = resolverTagParlamentar(
      criar({ status_eleicao_2026: 'eleito', situacao: 'ELEITO POR QP' }),
    );
    expect(tag?.descricao).toContain('ELEITO POR QP');
  });

  it('should return null when the candidate has no election status or situation', () => {
    expect(resolverTagParlamentar(criar({ status_eleicao_2026: '', situacao: null }))).toBeNull();
    const outro = resolverTagParlamentar(
      criar({ status_eleicao_2026: 'suplente_2', situacao: null }),
    );
    expect(outro?.situacao).toBe('outro');
    expect(outro?.classe).toBe('tag-neutral');
  });
});
