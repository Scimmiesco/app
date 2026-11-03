import { TestBed } from '@angular/core/testing';
import { EleicaoPresidencialDados } from '../../../core/models/contrato.model';
import { PresidencialTurnoComponent } from './presidencial-turno.component';

const dados1t: EleicaoPresidencialDados = {
  eleitores_aptos: 640427,
  comparecimento_abs: 512243,
  comparecimento_pct: 79.98,
  validos: 493722,
  lula: 159856,
  flavio: 289672,
  outros: 44194,
  pct_lula: 32.38,
  pct_flavio: 58.67,
  locais: 237,
  secoes: 2189,
};

const dados2t: EleicaoPresidencialDados = {
  ...dados1t,
  comparecimento_abs: 527124,
  comparecimento_pct: 82.31,
  validos: 511988,
  lula: 199121,
  flavio: 312867,
  outros: 0,
  pct_lula: 38.89,
  pct_flavio: 61.11,
};

function render(turno: 1 | 2, dados: EleicaoPresidencialDados): HTMLElement {
  const fixture = TestBed.createComponent(PresidencialTurnoComponent);
  fixture.componentRef.setInput('turno', turno);
  fixture.componentRef.setInput('dados', dados);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('PresidencialTurnoComponent', () => {
  it('should render the 1st round metrics, candidates and progress bars', () => {
    const el = render(1, dados1t);
    expect(el.textContent).toContain('640.427');
    expect(el.querySelector('[data-testid="card-presidencial-1t-flavio"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="card-presidencial-1t-lula"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="numero-candidato-flavio"]')?.textContent).toContain(
      '22',
    );
    expect(el.querySelector('[data-testid="numero-candidato-lula"]')?.textContent).toContain('13');
    expect(el.querySelector('[data-testid="card-presidencial-1t-flavio"]')?.textContent).toContain(
      '58,67%',
    );
    expect(
      el.querySelector('[data-testid="card-presidencial-1t-flavio"] .barra-votos-preenchimento'),
    ).toBeTruthy();
  });

  it('should render the 2nd round with turn-specific test ids and no third-party dispute', () => {
    const el = render(2, dados2t);
    expect(el.querySelector('[data-testid="card-presidencial-2t-flavio"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="numero-candidato-flavio-2t"]')).toBeTruthy();
    const outros = el.querySelector('[data-testid="card-presidencial-2t-outros"]');
    expect(outros?.textContent).toContain('Não disputaram o 2º turno');
    expect(outros?.textContent).toContain('0,00%');
  });
});
