import { TestBed } from '@angular/core/testing';
import { FonteMeta, SecaoEnvelope } from '../../../core/models/contrato.model';
import { CabecalhoSecaoComponent } from './cabecalho-secao.component';

const secao: SecaoEnvelope<unknown> = {
  titulo: 'Economia',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_pib_2023',
  ano: 2023,
  coletado_em: '2026-10-26',
  motivo: null,
  dados: {},
  mandato: '2027-2030',
};

const fonte: FonteMeta = {
  orgao: 'IBGE',
  titulo: 'PIB municipal 2023',
  url: 'https://sidra.ibge.gov.br/tabela/5938',
  consultado_em: '2026-10-26',
  confianca: 'oficial',
};

function render(inputs: Record<string, unknown>): HTMLElement {
  const fixture = TestBed.createComponent(CabecalhoSecaoComponent);
  fixture.componentRef.setInput('secao', secao);
  Object.entries(inputs).forEach(([chave, valor]) => fixture.componentRef.setInput(chave, valor));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CabecalhoSecaoComponent', () => {
  it('should render kicker, title, official badge and source link', () => {
    const el = render({
      fonte,
      kickerTestId: 'resumo-economia-kicker',
      tituloTestId: 'resumo-economia-titulo',
      linkTestId: 'fonte-link',
    });
    expect(el.querySelector('[data-testid="resumo-economia-kicker"]')?.textContent?.trim()).toBe(
      'A CIDADE',
    );
    expect(el.querySelector('h2')?.textContent?.trim()).toBe('Economia');
    expect(el.querySelector('.badge-oficial')).toBeTruthy();
    const link = el.querySelector('[data-testid="fonte-link"]') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe(fonte.url);
    expect(link.textContent).toContain('IBGE · PIB municipal 2023');
    expect(el.textContent).toContain('2023');
  });

  it('should render the mandate badge when requested', () => {
    const el = render({ mostrarMandato: true, mandatoTestId: 'governador-badge-mandato' });
    expect(el.querySelector('[data-testid="governador-badge-mandato"]')?.textContent?.trim()).toBe(
      'Mandato: 2027-2030',
    );
  });

  it('should render curado with pending validation note and pendente fallback', () => {
    const fixture = TestBed.createComponent(CabecalhoSecaoComponent);
    fixture.componentRef.setInput('secao', { ...secao, status: 'curado' });
    fixture.componentRef.setInput('textoCurado', true);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.badge-curado')).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Fonte curada — validação pendente',
    );

    fixture.componentRef.setInput('secao', { ...secao, status: 'pendente' });
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.badge-pendente')).toBeTruthy();
  });
});
