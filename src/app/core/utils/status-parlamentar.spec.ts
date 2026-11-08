import { ParlamentarItem } from '../models/contrato.model';
import {
  definirDataReferenciaMandato,
  estaEmMandatoNoMomento,
  proximaDataTransicaoMandato,
  resolverTagParlamentar,
  tentouENaoSeElegeu,
} from './status-parlamentar';

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

  it('should explain when the candidate ran for another office vs did not run', () => {
    const outroCargo = resolverTagParlamentar(
      criar({
        status_eleicao_2026: 'nao_concorreu_ao_cargo',
        cargo_2026: 'Senador',
        concorreu_2026: true,
        situacao: null,
      }),
    );
    expect(outroCargo?.situacao).toBe('outro_cargo');
    expect(outroCargo?.texto).toBe('outro cargo');
    expect(outroCargo?.testId).toBe('badge-nao-concorreu');
    expect(outroCargo?.descricao).toContain('Senador');

    const naoConcorreu = resolverTagParlamentar(
      criar({
        status_eleicao_2026: 'nao_concorreu_ao_cargo',
        concorreu_2026: false,
        situacao: null,
      }),
    );
    expect(naoConcorreu?.situacao).toBe('nao_concorreu');
    expect(naoConcorreu?.texto).toBe('não concorreu');
    expect(naoConcorreu?.testId).toBe('badge-nao-concorreu');
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

  it('should identify candidates who ran and were not elected', () => {
    expect(tentouENaoSeElegeu(criar({ status_eleicao_2026: 'eleito' }))).toBe(false);
    expect(tentouENaoSeElegeu(criar({ status_eleicao_2026: 'reeleito' }))).toBe(false);
    expect(tentouENaoSeElegeu(criar({ status_eleicao_2026: 'em_exercicio' }))).toBe(false);
    expect(tentouENaoSeElegeu(criar({ status_eleicao_2026: 'nao_reeleito' }))).toBe(true);
    expect(
      tentouENaoSeElegeu(criar({ status_eleicao_2026: 'nao_reeleito', situacao: 'SUPLENTE' })),
    ).toBe(true);
    expect(
      tentouENaoSeElegeu(
        criar({
          status_eleicao_2026: 'nao_concorreu_ao_cargo',
          concorreu_2026: true,
          situacao_2026_outro: 'NÃO ELEITO',
        }),
      ),
    ).toBe(true);
    expect(
      tentouENaoSeElegeu(
        criar({
          status_eleicao_2026: 'nao_concorreu_ao_cargo',
          concorreu_2026: true,
          situacao_2026_outro: 'ELEITO',
        }),
      ),
    ).toBe(false);
    expect(
      tentouENaoSeElegeu(
        criar({
          status_eleicao_2026: 'nao_concorreu_ao_cargo',
          concorreu_2026: false,
        }),
      ),
    ).toBe(false);
  });

  it('should dynamically evaluate whether a parlamentar is in mandate at the moment and know the next transition date', () => {
    const novoEleitoLegislativo = criar({
      em_exercicio: false,
      status_eleicao_2026: 'eleito',
      mandato_inicio: '2027-02-01',
      mandato_fim: '2031-01-31',
    });
    const reeleitoLegislativo = criar({
      em_exercicio: true,
      status_eleicao_2026: 'reeleito',
      mandato_inicio: '2027-02-01',
      mandato_fim: '2031-01-31',
    });
    const atualSaindo = criar({
      em_exercicio: true,
      status_eleicao_2026: 'nao_reeleito',
      mandato_inicio: '2023-02-01',
      mandato_fim: '2027-01-31',
    });
    const novoGovernador = criar({
      em_exercicio: false,
      status_eleicao_2026: 'eleito',
      mandato_inicio: '2027-01-01',
      mandato_fim: '2030-12-31',
    });
    const atualGovernadorSaindo = criar({
      em_exercicio: true,
      status_eleicao_2026: 'em_exercicio',
      mandato_inicio: '2023-01-01',
      mandato_fim: '2026-12-31',
    });

    // Em 2026-11-08: próxima transição conhecida é 2027-01-01 (posse Executivo)
    expect(proximaDataTransicaoMandato('2026-11-08')).toBe('2027-01-01');
    expect(estaEmMandatoNoMomento(novoEleitoLegislativo, '2026-11-08')).toBe(false);
    expect(estaEmMandatoNoMomento(reeleitoLegislativo, '2026-11-08')).toBe(true);
    expect(estaEmMandatoNoMomento(atualSaindo, '2026-11-08')).toBe(true);
    expect(estaEmMandatoNoMomento(novoGovernador, '2026-11-08')).toBe(false);
    expect(estaEmMandatoNoMomento(atualGovernadorSaindo, '2026-11-08')).toBe(true);

    // Em 2027-01-01: Governador eleito assume e o anterior encerra; próxima transição é 2027-02-01
    expect(proximaDataTransicaoMandato('2027-01-01')).toBe('2027-02-01');
    expect(estaEmMandatoNoMomento(novoGovernador, '2027-01-01')).toBe(true);
    expect(estaEmMandatoNoMomento(atualGovernadorSaindo, '2027-01-01')).toBe(false);
    expect(estaEmMandatoNoMomento(novoEleitoLegislativo, '2027-01-01')).toBe(false);
    expect(estaEmMandatoNoMomento(atualSaindo, '2027-01-01')).toBe(true);

    // Em 2027-02-01: Legislativo eleito assume e quem não se reelegeu encerra
    definirDataReferenciaMandato('2027-02-01');
    expect(estaEmMandatoNoMomento(novoEleitoLegislativo)).toBe(true);
    expect(estaEmMandatoNoMomento(reeleitoLegislativo)).toBe(true);
    expect(estaEmMandatoNoMomento(atualSaindo)).toBe(false);
    definirDataReferenciaMandato(null);
  });
});
