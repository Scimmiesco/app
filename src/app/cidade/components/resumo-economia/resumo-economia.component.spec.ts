import { TestBed } from '@angular/core/testing';
import { ResumoEconomiaDados, SecaoEnvelope } from '../../../core/models/contrato.model';
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
});
