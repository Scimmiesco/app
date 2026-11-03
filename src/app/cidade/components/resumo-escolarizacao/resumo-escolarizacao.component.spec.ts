import { TestBed } from '@angular/core/testing';
import { ResumoEscolarizacaoDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import { ResumoEscolarizacaoComponent } from './resumo-escolarizacao.component';

const secao: SecaoEnvelope<ResumoEscolarizacaoDados> = {
  titulo: 'Escolarização (6 a 14 anos)',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_indicadores_60045',
  ano: 2022,
  coletado_em: '2026-11-03T14:18:07-0400',
  motivo: null,
  dados: { faixa_6_14_pct: 98.07 },
};

describe('ResumoEscolarizacaoComponent', () => {
  it('should render the schooling rate with two decimals', () => {
    const fixture = TestBed.createComponent(ResumoEscolarizacaoComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="card-metrica-escolarizacao"]',
      )?.textContent,
    ).toContain('98,07%');
  });
});
