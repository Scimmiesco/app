import { TestBed } from '@angular/core/testing';
import { ResumoFinancasDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import { ResumoFinancasComponent } from './resumo-financas.component';

const secao: SecaoEnvelope<ResumoFinancasDados> = {
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

describe('ResumoFinancasComponent', () => {
  it('should render DCA gross revenues and committed expenditures', () => {
    const fixture = TestBed.createComponent(ResumoFinancasComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="card-metrica-receita-bruta"]')?.textContent).toContain(
      '6.060.081.890,75',
    );
    expect(el.querySelector('[data-testid="card-metrica-despesa-bruta"]')?.textContent).toContain(
      '6.393.130.012,43',
    );
  });
});
