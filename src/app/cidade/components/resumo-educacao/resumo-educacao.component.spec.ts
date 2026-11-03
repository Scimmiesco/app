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
});
