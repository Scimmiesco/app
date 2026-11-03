import { TestBed } from '@angular/core/testing';
import {
  ResumoEconomiaDados,
  ResumoFinancasDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { ResumoEconomiaComponent } from './resumo-economia.component';

const secao: SecaoEnvelope<ResumoEconomiaDados> = {
  titulo: 'Economia',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_pib_2023',
  ano: 2023,
  coletado_em: '2026-10-26',
  motivo: null,
  dados: { pib_total: 34731175000, pib_per_capita: 38671.84 },
};

const secaoFinancas: SecaoEnvelope<ResumoFinancasDados> = {
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
  },
};

const secaoFinancasAlternativa: SecaoEnvelope<ResumoFinancasDados> = {
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
      '38.671,84',
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
});
