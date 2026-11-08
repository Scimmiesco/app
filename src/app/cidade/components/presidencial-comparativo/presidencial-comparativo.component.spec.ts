import { TestBed } from '@angular/core/testing';
import { EleicaoPresidencialDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import { PresidencialComparativoComponent } from './presidencial-comparativo.component';

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
  eleitores_aptos: 640427,
  comparecimento_abs: 527124,
  comparecimento_pct: 82.31,
  validos: 511988,
  lula: 199121,
  flavio: 312867,
  outros: 0,
  pct_lula: 38.89,
  pct_flavio: 61.11,
  locais: 237,
  secoes: 2189,
};

function envelope(dados: EleicaoPresidencialDados): SecaoEnvelope<EleicaoPresidencialDados> {
  return {
    titulo: 'Presidencial',
    categoria: 'ELEIÇÃO 2026',
    status: 'oficial',
    fonte: 'tse_2026_1t',
    ano: 2026,
    coletado_em: '2026-10-30',
    motivo: null,
    dados,
  };
}

function render(): HTMLElement {
  const fixture = TestBed.createComponent(PresidencialComparativoComponent);
  fixture.componentRef.setInput('secao1t', envelope(dados1t));
  fixture.componentRef.setInput('secao2t', envelope(dados2t));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('PresidencialComparativoComponent', () => {
  it('should render official comparative metrics and variation table', () => {
    const el = render();
    expect(el.querySelector('[data-testid="comparativo-metricas-gerais"]')?.textContent).toContain(
      '82,31%',
    );
    expect(el.querySelector('[data-testid="card-comp-flavio"]')?.textContent).toContain('+23.195');
    expect(el.querySelector('[data-testid="card-comp-lula"]')?.textContent).toContain('+39.265');
    expect(el.querySelector('[data-testid="card-comp-comparecimento"]')?.textContent).toContain(
      '44.194',
    );

    const resumoCards = el.querySelectorAll(
      '[data-testid="comparativo-cards-resumo"] .card-candidato',
    );
    expect(resumoCards.length).toBe(3);
    resumoCards.forEach((card) => {
      expect(card.querySelector('.nome-candidato.truncate')).toBeTruthy();
      expect(card.querySelector('.numero-candidato')).toBeTruthy();
    });

    const headers = el.querySelectorAll('[data-testid="tabela-comparativa-presidencial"] thead th');
    expect(headers.length).toBe(4);
    expect(headers[0].textContent?.trim()).toBe('Candidato / Métrica');
    expect(headers[1].textContent?.trim()).toBe('1º Turno');
    expect(headers[2].textContent?.trim()).toBe('2º Turno');
    expect(headers[3].textContent?.trim()).toBe('Variação');

    const rows = el.querySelectorAll('[data-testid="tabela-comparativa-presidencial"] tbody tr');
    expect(rows.length).toBe(4);
    expect(el.textContent).toContain('+6,51 p.p.');
    expect(el.textContent).toContain('+2,44 p.p.');

    expect(el.querySelector('[data-testid="tag-status-flavio"]')?.textContent?.trim()).toBe(
      'não eleito',
    );
    expect(el.querySelector('[data-testid="tag-status-lula"]')?.textContent?.trim()).toBe(
      'reeleito',
    );
    expect(el.querySelector('[data-testid="tag-status-outros"]')?.textContent?.trim()).toBe(
      '1º turno',
    );
    expect(el.querySelector('[data-testid="avatar-outros-candidatos"] svg')).toBeTruthy();
    expect(
      el
        .querySelector('[data-testid="avatar-outros-candidatos"] svg')
        ?.classList.contains('candidato-avatar-nao-eleito'),
    ).toBe(true);
    expect(
      el
        .querySelector('tr[data-partido="PL"] [data-testid="candidato-avatar-img"]')
        ?.classList.contains('candidato-avatar-nao-eleito'),
    ).toBe(true);
    expect(
      el
        .querySelector('tr[data-partido="PT"] [data-testid="candidato-avatar-img"]')
        ?.classList.contains('candidato-avatar-nao-eleito'),
    ).toBe(false);
    expect(el.querySelector('tr[data-partido="PT"]')?.classList.contains('eleito')).toBe(true);
    expect(el.querySelector('tr[data-partido="PL"]')?.classList.contains('eleito')).toBe(false);
    expect(el.querySelector('tr[data-partido="OUTROS"]')?.classList.contains('eleito')).toBe(false);
    expect(el.querySelector('[data-testid="outros-votos-2t"]')?.textContent?.trim()).toBe('-');

    const badgesOutros = el.querySelectorAll('.badge-outros');
    expect(badgesOutros.length).toBe(2);
  });

  it('should show pending state when one of the rounds is missing', () => {
    const fixture = TestBed.createComponent(PresidencialComparativoComponent);
    fixture.componentRef.setInput('secao1t', envelope(dados1t));
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[data-testid="comparativo-pendente"]'),
    ).toBeTruthy();
  });
});
