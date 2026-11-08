import { TestBed } from '@angular/core/testing';
import {
  EconomiaBenchmark,
  ResumoEconomiaDados,
  ResumoFinancasDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { ResumoEconomiaComponent } from './resumo-economia.component';

const secao: SecaoEnvelope<ResumoEconomiaDados, EconomiaBenchmark> = {
  titulo: 'Economia',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_pib_2023',
  ano: 2023,
  coletado_em: '2026-10-26',
  motivo: null,
  dados: { pib_total: 42269768000, pib_per_capita: 47065.77 },
};

const secaoFinancas: SecaoEnvelope<ResumoFinancasDados, EconomiaBenchmark> = {
  titulo: 'Finanças municipais',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'siconfi_dca_2025',
  ano: 2025,
  coletado_em: '2026-11-03T14:18:07-0400',
  motivo: null,
  dados: {
    receita_bruta: 6060081890.75,
    despesa_bruta: 6393130012.43,
    resultado_orcamentario: -333048121.68,
    resultado_orcamentario_pct: -5.5,
    situacao_orcamentaria: 'deficit',
  },
};

const secaoComBenchmark: SecaoEnvelope<ResumoEconomiaDados, EconomiaBenchmark> = {
  ...secao,
  benchmark: {
    comparacoes: {
      pib_total: {
        valor: 42269768000,
        desvio_mediana: 41960750000,
        desvio_pct_mediana: 13578.74,
        fator_mediana: 136.79,
        posicao: 34,
        posicao_total: 5570,
        quartil: 4,
        percentil: 99.4,
        faixa: 'muito_acima',
        faixa_rotulo: 'Muito acima da mediana',
        n: 5570,
        mediana: 309018000,
        fonte_titulo: 'PIB Municipal 2023 (IBGE SIDRA 5938)',
      },
      pib_per_capita: {
        valor: 47065.77,
        desvio_mediana: 17171.15,
        desvio_pct_mediana: 57.44,
        percentil: 72.45,
        faixa: 'acima',
        faixa_rotulo: 'Acima da mediana',
        n: 5570,
        mediana: 29894.62,
        fonte_titulo: 'PIB Per Capita 2023 (IBGE 47001)',
      },
      renda_media_pc: {
        valor: 2088.31,
        desvio_mediana: 905.77,
        desvio_pct_mediana: 76.6,
        percentil: 94.87,
        faixa: 'muito_acima',
        faixa_rotulo: 'Muito acima da mediana',
        n: 5570,
        mediana: 1182.54,
      },
      renda_mediana_pc: {
        valor: 868.0,
        desvio_mediana: -32.0,
        desvio_pct_mediana: -3.56,
        percentil: 48.34,
        faixa: 'proximo',
        faixa_rotulo: 'Próximo da mediana',
        n: 5570,
        mediana: 900.0,
      },
    },
  },
};

const secaoFinancasComBenchmark: SecaoEnvelope<ResumoFinancasDados, EconomiaBenchmark> = {
  ...secaoFinancas,
  benchmark: {
    comparacoes: {
      receita_bruta: {
        valor: 6060081890.75,
        desvio_mediana: 5967717168.64,
        desvio_pct_mediana: 6461.04,
        fator_mediana: 65.61,
        posicao: 19,
        posicao_total: 5442,
        quartil: 4,
        percentil: 99.66,
        faixa: 'muito_acima',
        faixa_rotulo: 'Muito acima da mediana',
        n: 5442,
        mediana: 92364722.11,
      },
      despesa_bruta: {
        valor: 82574279.67,
        desvio_mediana: 0,
        desvio_pct_mediana: 0,
        fator_mediana: 1.0,
        posicao: 2722,
        posicao_total: 5443,
        quartil: 2,
        percentil: 50.0,
        faixa: 'proximo',
        faixa_rotulo: 'Na mediana nacional',
        n: 5443,
        mediana: 82574279.67,
      },
      resultado_orcamentario: {
        valor: -333048121.68,
        desvio_mediana: -342177567.63,
        desvio_pct_mediana: -3748.06,
        fator_mediana: -36.48,
        posicao: 5437,
        posicao_total: 5442,
        quartil: 1,
        percentil: 0.1,
        faixa: 'muito_abaixo',
        faixa_rotulo: 'Muito abaixo da mediana',
        n: 5442,
        mediana: 9129445.95,
      },
    },
  },
};

const secaoFinancasAlternativa: SecaoEnvelope<ResumoFinancasDados, EconomiaBenchmark> = {
  titulo: 'Finanças municipais',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'siconfi_dca_2025',
  ano: 2025,
  coletado_em: '2026-11-03T14:18:07-0400',
  motivo: null,
  dados: {
    receita_total: 4200000000,
    transferencias_correntes: 1500000000,
    iptu: 680000000,
    iss: 720000000,
  },
};

describe('ResumoEconomiaComponent', () => {
  it('should render PIB total and per capita as currency', () => {
    const fixture = TestBed.createComponent(ResumoEconomiaComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="resumo-economia-kicker"]')?.textContent?.trim()).toBe(
      'A CIDADE',
    );
    expect(el.querySelector('[data-testid="card-metrica-pib-total"]')?.textContent).toContain('R$');
    expect(el.querySelector('[data-testid="card-metrica-pib-per-capita"]')?.textContent).toContain(
      '47.065,77',
    );
  });

  it('should render municipal finances when secaoFinancas is provided', () => {
    const fixture = TestBed.createComponent(ResumoEconomiaComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.componentRef.setInput('secaoFinancas', secaoFinancas);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('[data-testid="card-resumo-financas"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="resumo-financas-kicker"]')?.textContent?.trim()).toBe(
      'A CIDADE',
    );
    expect(el.querySelector('[data-testid="card-metrica-receita-bruta"]')?.textContent).toContain(
      '6.060.081.890,75',
    );
    expect(el.querySelector('[data-testid="card-metrica-despesa-bruta"]')?.textContent).toContain(
      '6.393.130.012,43',
    );
    expect(
      el.querySelector('[data-testid="card-metrica-resultado-orcamentario"]')?.textContent,
    ).toContain('333.048.121,68');
  });

  it('should render alternative municipal finances breakdown', () => {
    const fixture = TestBed.createComponent(ResumoEconomiaComponent);
    fixture.componentRef.setInput('secaoFinancas', secaoFinancasAlternativa);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('[data-testid="card-resumo-financas"]')).toBeTruthy();
    expect(el.textContent).toContain('Receita Total');
    expect(el.textContent).toContain('Transferências');
    expect(el.textContent).toContain('IPTU Arrecadado');
    expect(el.textContent).toContain('ISS Arrecadado');
  });

  it('should render income metrics alongside economy when provided', () => {
    const fixture = TestBed.createComponent(ResumoEconomiaComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.componentRef.setInput('rendaMedia', 2088.31);
    fixture.componentRef.setInput('rendaMediana', 1237.33);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const rendaMediaEl = el.querySelector('[data-testid="card-metrica-renda-media"]');
    expect(rendaMediaEl).toBeTruthy();
    expect(rendaMediaEl?.textContent).toContain('2.088,31');

    const rendaMedianaEl = el.querySelector('[data-testid="card-metrica-renda-mediana"]');
    expect(rendaMedianaEl).toBeTruthy();
    expect(rendaMedianaEl?.textContent).toContain('1.237,33');
  });

  it('should render national benchmark percentage indicators for economy and municipal finances', () => {
    const fixture = TestBed.createComponent(ResumoEconomiaComponent);
    fixture.componentRef.setInput('secao', secaoComBenchmark);
    fixture.componentRef.setInput('secaoFinancas', secaoFinancasComBenchmark);
    fixture.componentRef.setInput('rendaMedia', 2088.31);
    fixture.componentRef.setInput('rendaMediana', 868.0);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const indPibTotal = el.querySelector('[data-testid="indicador-benchmark-pib-total"]');
    expect(indPibTotal).toBeTruthy();
    expect(indPibTotal?.textContent).toContain('▲');
    expect(indPibTotal?.textContent).toContain('34º no Brasil');
    expect(indPibTotal?.classList.contains('indicador-benchmark--verde')).toBe(true);
    expect(indPibTotal?.getAttribute('title')).toContain(
      '34º maior PIB entre 5.570 municípios do Brasil',
    );
    expect(indPibTotal?.getAttribute('title')).toContain('Top 1%');

    const quartilPib = el.querySelector('[data-testid="quartil-pib-total"]');
    expect(quartilPib).toBeTruthy();
    expect(quartilPib?.textContent).toContain('4º quartil nacional (Top 1% — maiores do Brasil)');

    const indPibPc = el.querySelector('[data-testid="indicador-benchmark-pib-per-capita"]');
    expect(indPibPc).toBeTruthy();
    expect(indPibPc?.textContent).toContain('▲');
    expect(indPibPc?.textContent).toContain('+57,4%');
    expect(indPibPc?.classList.contains('indicador-benchmark--verde')).toBe(true);
    expect(indPibPc?.getAttribute('title')).toContain('29.894,62');

    const indRendaMediana = el.querySelector('[data-testid="indicador-benchmark-renda-mediana"]');
    expect(indRendaMediana).toBeTruthy();
    expect(indRendaMediana?.textContent).toContain('▼');
    expect(indRendaMediana?.textContent).toContain('-3,6%');
    expect(indRendaMediana?.classList.contains('indicador-benchmark--vermelho')).toBe(true);

    const indReceita = el.querySelector('[data-testid="indicador-benchmark-receita-bruta"]');
    expect(indReceita).toBeTruthy();
    expect(indReceita?.textContent).toContain('▲');
    expect(indReceita?.textContent).toContain('19º no Brasil');
    expect(indReceita?.getAttribute('title')).toContain(
      '19º maior orçamento de receitas entre 5.442 municípios',
    );

    const quartilReceita = el.querySelector('[data-testid="quartil-receita-bruta"]');
    expect(quartilReceita).toBeTruthy();
    expect(quartilReceita?.textContent).toContain(
      '4º quartil nacional (Top 1% — maiores do Brasil)',
    );

    const indDespesa = el.querySelector('[data-testid="indicador-benchmark-despesa-bruta"]');
    expect(indDespesa).toBeTruthy();
    expect(indDespesa?.textContent).toContain('●');
    expect(indDespesa?.textContent).toContain('2.722º no Brasil');
    expect(indDespesa?.classList.contains('indicador-benchmark--preto')).toBe(true);

    const quartilDespesa = el.querySelector('[data-testid="quartil-despesa-bruta"]');
    expect(quartilDespesa).toBeTruthy();
    expect(quartilDespesa?.textContent).toContain('2º quartil nacional (abaixo da mediana)');

    const indResultado = el.querySelector(
      '[data-testid="indicador-benchmark-resultado-orcamentario"]',
    );
    expect(indResultado).toBeTruthy();
    expect(indResultado?.textContent).toContain('▼');
    expect(indResultado?.textContent).toContain('Déficit');
    expect(indResultado?.textContent).toContain('5,50%');
    expect(indResultado?.classList.contains('indicador-benchmark--vermelho')).toBe(true);

    const subResultado = el.querySelector('[data-testid="subtitulo-resultado-orcamentario"]');
    expect(subResultado).toBeTruthy();
    expect(subResultado?.textContent).toContain('Despesas empenhadas superaram receitas');
  });
});
