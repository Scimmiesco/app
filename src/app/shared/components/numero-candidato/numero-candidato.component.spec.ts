import { TestBed } from '@angular/core/testing';
import { NumeroHistorico } from '../../../core/models/contrato.model';
import { NumeroCandidatoComponent } from './numero-candidato.component';

function render(
  numero: string | number | null,
  historico: NumeroHistorico | null = null,
): HTMLElement {
  const fixture = TestBed.createComponent(NumeroCandidatoComponent);
  fixture.componentRef.setInput('numero', numero);
  fixture.componentRef.setInput('historico', historico);
  fixture.componentRef.setInput('partido', 'PT');
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('NumeroCandidatoComponent', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(NumeroCandidatoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the current number with party-colored prefix', () => {
    const el = render('1367');
    const numero = el.querySelector('[data-testid="numero-candidato"]');
    expect(numero?.classList.contains('numero-historico')).toBe(false);
    expect(numero?.querySelector('.digito-partido')?.textContent?.trim()).toBe('13');
    expect((numero?.querySelector('.digito-partido') as HTMLElement).style.color).toBe(
      'rgb(160, 0, 28)',
    );
    expect(numero?.querySelector('.digito-resto')?.textContent?.trim()).toBe('67');
  });

  it('should render the historical number with year when there is no current number', () => {
    const el = render(null, {
      numero: '1331',
      ano: 2022,
      cargo: 'DEPUTADO FEDERAL',
      fonte: 'tse_candidatos_2022',
    });
    const numero = el.querySelector('[data-testid="numero-candidato"]');
    expect(numero?.classList.contains('numero-historico')).toBe(true);
    expect(numero?.textContent).toContain('Último:');
    expect(numero?.textContent).toContain('1331');
    expect(numero?.textContent).toContain('2022');
  });

  it('should not render when neither current nor historical number exists', () => {
    const el = render(null);
    expect(el.querySelector('[data-testid="numero-candidato"]')).toBeNull();
  });
});
