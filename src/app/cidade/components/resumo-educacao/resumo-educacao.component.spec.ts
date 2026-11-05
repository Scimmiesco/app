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
  });

  it('should render subtle national benchmark indicators on a 0 to 1 scale with semantic colors', () => {
    const fixture = TestBed.createComponent(ResumoEducacaoComponent);
    fixture.componentRef.setInput('secao', secaoComBenchmark);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    // Anos Iniciais - Municipal: percentil 81.46 -> 0,81 (verde, ▲)
    const badgeIniciaisMun = el.querySelector(
      '[data-testid="badge-benchmark-iniciais-Municipal"]',
    ) as HTMLElement;
    expect(badgeIniciaisMun).toBeTruthy();
    expect(badgeIniciaisMun.textContent).toContain('0,81');
    expect(badgeIniciaisMun.textContent).toContain('▲');
    expect(badgeIniciaisMun.classList.contains('badge-verde')).toBe(true);
    expect(badgeIniciaisMun.getAttribute('title')).toContain('0,81');
    expect(badgeIniciaisMun.getAttribute('title')).toContain('Mediana dos municípios: 6,2 (+0,7)');
    expect(badgeIniciaisMun.getAttribute('aria-label')).toContain('Municipal: nota 6.9');
    expect(badgeIniciaisMun.getAttribute('aria-label')).toContain('0,81 de 0 a 1');

    // Anos Iniciais - Estadual: percentil 5.16 -> 0,05 (vermelho, ▼)
    const badgeIniciaisEst = el.querySelector(
      '[data-testid="badge-benchmark-iniciais-Estadual"]',
    ) as HTMLElement;
    expect(badgeIniciaisEst).toBeTruthy();
    expect(badgeIniciaisEst.textContent).toContain('0,05');
    expect(badgeIniciaisEst.textContent).toContain('▼');
    expect(badgeIniciaisEst.classList.contains('badge-vermelho')).toBe(true);

    // Anos Finais - Estadual: percentil 49.57 -> 0,50 (preto/dark, ● na mediana)
    const badgeFinaisEst = el.querySelector(
      '[data-testid="badge-benchmark-finais-Estadual"]',
    ) as HTMLElement;
    expect(badgeFinaisEst).toBeTruthy();
    expect(badgeFinaisEst.textContent).toContain('0,50');
    expect(badgeFinaisEst.textContent).toContain('●');
    expect(badgeFinaisEst.classList.contains('badge-dark')).toBe(true);

    // Anos Finais - Municipal: percentil 29.52 -> 0,30 (vermelho, ▼)
    const badgeFinaisMun = el.querySelector(
      '[data-testid="badge-benchmark-finais-Municipal"]',
    ) as HTMLElement;
    expect(badgeFinaisMun).toBeTruthy();
    expect(badgeFinaisMun.textContent).toContain('0,30');
    expect(badgeFinaisMun.textContent).toContain('▼');
    expect(badgeFinaisMun.classList.contains('badge-vermelho')).toBe(true);

    // Micro-legendas
    const legendaIniciais = el.querySelector('[data-testid="legenda-benchmark-iniciais"]');
    expect(legendaIniciais).toBeTruthy();
    expect(legendaIniciais?.textContent).toContain('Posição nacional (0 a 1)');
    expect(legendaIniciais?.textContent).toContain('▲ melhor');
    expect(legendaIniciais?.textContent).toContain('● mediana');
    expect(legendaIniciais?.textContent).toContain('▼ abaixo');
  });

  it('should not render benchmark badges or legend when benchmark is missing', () => {
    const fixture = TestBed.createComponent(ResumoEducacaoComponent);
    fixture.componentRef.setInput('secao', secao); // no benchmark
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('[data-testid="badge-benchmark-iniciais-2023"]')).toBeNull();
    expect(el.querySelector('[data-testid="legenda-benchmark-iniciais"]')).toBeNull();
    expect(el.querySelector('[data-testid="legenda-benchmark-finais"]')).toBeNull();
  });
});
