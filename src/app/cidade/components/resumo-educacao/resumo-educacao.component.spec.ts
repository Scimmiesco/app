import { TestBed } from '@angular/core/testing';
import {
  ResumoEducacaoDados,
  ResumoEscolarizacaoDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { ResumoEducacaoComponent } from './resumo-educacao.component';

const secao: SecaoEnvelope<ResumoEducacaoDados> = {
  titulo: 'Educação',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'inep_ideb_2023',
  ano: 2023,
  coletado_em: '2026-10-26',
  motivo: null,
  dados: { anos_iniciais: { '2023': 5.8 }, anos_finais: { '2023': 5.1 } },
};

const secaoEscolarizacao: SecaoEnvelope<ResumoEscolarizacaoDados> = {
  titulo: 'Escolarização',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_censo_2022',
  ano: 2022,
  coletado_em: '2026-10-26',
  motivo: null,
  dados: { faixa_6_14_pct: 98.07 },
};

const secaoEscolarizacaoComBenchmark: SecaoEnvelope<ResumoEscolarizacaoDados> = {
  titulo: 'Escolarização',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_censo_2022',
  ano: 2022,
  coletado_em: '2026-10-26',
  motivo: null,
  dados: { faixa_6_14_pct: 98.07 },
  benchmark: {
    valor: 98.07,
    mediana: 97.85,
    desvio_mediana: 0.22,
    percentil: 62.4,
    faixa: 'acima',
    faixa_rotulo: 'Acima da mediana',
    n: 5570,
  },
};

const secaoComBenchmark: SecaoEnvelope<ResumoEducacaoDados> = {
  titulo: 'Educação',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'inep_ideb_2025',
  ano: 2025,
  coletado_em: '2026-11-05',
  motivo: null,
  dados: {
    anos_iniciais: {
      Municipal: 6.9,
      Estadual: 5.2,
    },
    anos_finais: {
      Estadual: 5.3,
      Municipal: 4.9,
    },
  },
  benchmark: {
    meta: {
      indicador: 'ideb',
      ano: 2025,
      universo: 'municipios brasileiros com IDEB 2025 publicado',
      ponderacao: 'nao_ponderada',
    },
    comparacoes: {
      anos_iniciais: {
        Municipal: {
          valor: 6.9,
          desvio_mediana: 0.7,
          percentil: 81.46,
          faixa: 'acima',
          faixa_rotulo: 'Acima da mediana',
          n: 5320,
          mediana: 6.2,
        },
        Estadual: {
          valor: 5.2,
          desvio_mediana: -1.3,
          percentil: 5.16,
          faixa: 'muito_abaixo',
          faixa_rotulo: 'Muito abaixo da mediana',
          n: 1094,
          mediana: 6.5,
        },
      },
      anos_finais: {
        Estadual: {
          valor: 5.3,
          desvio_mediana: 0.0,
          percentil: 49.57,
          faixa: 'proximo',
          faixa_rotulo: 'Próximo da mediana',
          n: 3613,
          mediana: 5.3,
        },
        Municipal: {
          valor: 4.9,
          desvio_mediana: -0.4,
          percentil: 29.52,
          faixa: 'abaixo',
          faixa_rotulo: 'Abaixo da mediana',
          n: 5320,
          mediana: 5.3,
        },
      },
    },
  },
};

describe('ResumoEducacaoComponent', () => {
  it('should render IDEB for early and final years', () => {
    const fixture = TestBed.createComponent(ResumoEducacaoComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Anos Iniciais');
    expect(texto).toContain('5.8');
    expect(texto).toContain('Anos Finais');
    expect(texto).toContain('5.1');
  });

  it('should render schooling rate when secaoEscolarizacao is provided', () => {
    const fixture = TestBed.createComponent(ResumoEducacaoComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.componentRef.setInput('secaoEscolarizacao', secaoEscolarizacao);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cardEsc = el.querySelector('[data-testid="card-resumo-escolarizacao"]');
    expect(cardEsc).toBeTruthy();
    expect(cardEsc?.textContent).toContain('98,07%');
    expect(cardEsc?.textContent).toContain('2022');
    expect(el.querySelector('[data-testid="indicador-benchmark-escolarizacao"]')).toBeNull();
  });

  it('should render benchmark indicator for schooling rate when benchmark is provided', () => {
    const fixture = TestBed.createComponent(ResumoEducacaoComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.componentRef.setInput('secaoEscolarizacao', secaoEscolarizacaoComBenchmark);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const indEsc = el.querySelector(
      '[data-testid="indicador-benchmark-escolarizacao"]',
    ) as HTMLElement;
    expect(indEsc).toBeTruthy();
    expect(indEsc.textContent).toContain('+0,22 p.p.');
    expect(indEsc.textContent).toContain('▲');
    expect(indEsc.classList.contains('indicador-benchmark--verde')).toBe(true);
    expect(indEsc.getAttribute('title')).toContain('Diferença da mediana nacional: +0,22 p.p.');
    expect(indEsc.getAttribute('title')).toContain(
      'Mediana dos municípios: 97,85% em 5.570 cidades',
    );
    expect(indEsc.getAttribute('aria-label')).toContain('Taxa de Escolarização: 98,07%');
    expect(indEsc.getAttribute('aria-label')).toContain(
      'Diferença da mediana nacional: +0,22 p.p.',
    );
  });

  it('should color only the number without badge styling showing deviation from median and single unified legend', () => {
    const fixture = TestBed.createComponent(ResumoEducacaoComponent);
    fixture.componentRef.setInput('secao', secaoComBenchmark);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    // Anos Iniciais - Municipal: desvio +0,7 (verde, ▲, NÃO é badge)
    const indIniciaisMun = el.querySelector(
      '[data-testid="indicador-benchmark-iniciais-Municipal"]',
    ) as HTMLElement;
    expect(indIniciaisMun).toBeTruthy();
    expect(indIniciaisMun.textContent).toContain('+0,7');
    expect(indIniciaisMun.textContent).toContain('▲');
    expect(indIniciaisMun.classList.contains('indicador-benchmark')).toBe(true);
    expect(indIniciaisMun.classList.contains('indicador-benchmark--verde')).toBe(true);
    expect(indIniciaisMun.classList.contains('badge')).toBe(false);
    expect(indIniciaisMun.getAttribute('title')).toContain('Diferença da mediana nacional: +0,7');
    expect(indIniciaisMun.getAttribute('title')).toContain(
      'Mediana dos municípios: 6,2 em 5.320 cidades',
    );
    expect(indIniciaisMun.getAttribute('aria-label')).toContain('Municipal: nota IDEB 6.9');
    expect(indIniciaisMun.getAttribute('aria-label')).toContain(
      'Diferença da mediana nacional: +0,7',
    );

    // Anos Iniciais - Estadual: desvio -1,3 (vermelho, ▼)
    const indIniciaisEst = el.querySelector(
      '[data-testid="indicador-benchmark-iniciais-Estadual"]',
    ) as HTMLElement;
    expect(indIniciaisEst).toBeTruthy();
    expect(indIniciaisEst.textContent).toContain('-1,3');
    expect(indIniciaisEst.textContent).toContain('▼');
    expect(indIniciaisEst.classList.contains('indicador-benchmark--vermelho')).toBe(true);
    expect(indIniciaisEst.classList.contains('badge')).toBe(false);
    expect(indIniciaisEst.getAttribute('title')).toContain('Diferença da mediana nacional: -1,3');
    expect(indIniciaisEst.getAttribute('aria-label')).toContain(
      'Diferença da mediana nacional: -1,3',
    );

    // Anos Finais - Estadual: desvio 0,0 (preto, ● na mediana)
    const indFinaisEst = el.querySelector(
      '[data-testid="indicador-benchmark-finais-Estadual"]',
    ) as HTMLElement;
    expect(indFinaisEst).toBeTruthy();
    expect(indFinaisEst.textContent).toContain('0,0');
    expect(indFinaisEst.textContent).toContain('●');
    expect(indFinaisEst.classList.contains('indicador-benchmark--preto')).toBe(true);
    expect(indFinaisEst.classList.contains('badge')).toBe(false);
    expect(indFinaisEst.getAttribute('title')).toContain('Diferença da mediana nacional: 0,0');
    expect(indFinaisEst.getAttribute('aria-label')).toContain('Diferença da mediana nacional: 0,0');

    // Anos Finais - Municipal: desvio -0,4 (vermelho, ▼)
    const indFinaisMun = el.querySelector(
      '[data-testid="indicador-benchmark-finais-Municipal"]',
    ) as HTMLElement;
    expect(indFinaisMun).toBeTruthy();
    expect(indFinaisMun.textContent).toContain('-0,4');
    expect(indFinaisMun.textContent).toContain('▼');
    expect(indFinaisMun.classList.contains('indicador-benchmark--vermelho')).toBe(true);
    expect(indFinaisMun.classList.contains('badge')).toBe(false);
    expect(indFinaisMun.getAttribute('title')).toContain('Diferença da mediana nacional: -0,4');
    expect(indFinaisMun.getAttribute('aria-label')).toContain(
      'Diferença da mediana nacional: -0,4',
    );

    // Legenda unificada em um lugar só (no rodapé da seção)
    const legendaUnificada = el.querySelector('[data-testid="legenda-benchmark-educacao"]');
    expect(legendaUnificada).toBeTruthy();
    expect(legendaUnificada?.textContent).toContain('Diferença da mediana nacional:');
    expect(legendaUnificada?.textContent).toContain('▲ acima da mediana');
    expect(legendaUnificada?.textContent).toContain('● na mediana (0,0)');
    expect(legendaUnificada?.textContent).toContain('▼ abaixo da mediana');

    // Não existem mais legendas individuais nos cartões
    expect(el.querySelector('[data-testid="legenda-benchmark-iniciais"]')).toBeNull();
    expect(el.querySelector('[data-testid="legenda-benchmark-finais"]')).toBeNull();
  });

  it('should not render benchmark indicators or unified legend when benchmark is missing', () => {
    const fixture = TestBed.createComponent(ResumoEducacaoComponent);
    fixture.componentRef.setInput('secao', secao); // no benchmark
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('[data-testid="indicador-benchmark-iniciais-2023"]')).toBeNull();
    expect(el.querySelector('[data-testid="legenda-benchmark-educacao"]')).toBeNull();
  });
});
