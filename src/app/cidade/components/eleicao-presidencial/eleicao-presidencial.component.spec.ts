import { TestBed } from '@angular/core/testing';
import {
  EleicaoPresidencialDados,
  FonteMeta,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { EleicaoPresidencialComponent } from './eleicao-presidencial.component';

const dados: EleicaoPresidencialDados = {
  eleitores_aptos: 640427,
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

function envelope(
  fonte: string,
  dadosSecao: EleicaoPresidencialDados,
): SecaoEnvelope<EleicaoPresidencialDados> {
  return {
    titulo: 'Presidencial',
    categoria: 'ELEIÇÃO 2026',
    status: 'oficial',
    fonte,
    ano: 2026,
    coletado_em: '2026-10-30',
    motivo: null,
    dados: dadosSecao,
  };
}

const fonte: FonteMeta = {
  orgao: 'TSE',
  titulo: 'Votação por seção 2026',
  url: 'https://resultados.tse.jus.br/',
  consultado_em: '2026-10-06',
  confianca: 'oficial',
};

describe('EleicaoPresidencialComponent', () => {
  it('should navigate between 1t, 2t and comparativo tabs', () => {
    const fixture = TestBed.createComponent(EleicaoPresidencialComponent);
    fixture.componentRef.setInput('secao1t', envelope('tse_2026_1t', dados));
    fixture.componentRef.setInput('secao2t', envelope('tse_2026_2t_bu', { ...dados, outros: 0 }));
    fixture.componentRef.setInput('fonte1t', fonte);
    fixture.componentRef.setInput('fonte2t', fonte);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="painel-presidencial-1t"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="card-presidencial-1t-lula"]')).toBeTruthy();

    (el.querySelector('[data-testid="aba-2t"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.abaPresidencial()).toBe('2t');
    expect(el.querySelector('[data-testid="painel-presidencial-2t"]')).toBeTruthy();

    (el.querySelector('[data-testid="aba-comparativo"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="tabela-comparativa-presidencial"]')).toBeTruthy();
  });

  it('should show the source of the active round', () => {
    const fixture = TestBed.createComponent(EleicaoPresidencialComponent);
    fixture.componentRef.setInput('secao1t', envelope('tse_2026_1t', dados));
    fixture.componentRef.setInput('secao2t', envelope('tse_2026_2t_bu', { ...dados, outros: 0 }));
    fixture.componentRef.setInput('fonte1t', fonte);
    fixture.componentRef.setInput('fonte2t', { ...fonte, titulo: 'Votação 2º turno' });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="header-eleicao-presidencial"]')?.textContent).toContain(
      'Votação por seção 2026',
    );

    (el.querySelector('[data-testid="aba-2t"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="header-eleicao-presidencial"]')?.textContent).toContain(
      'Votação 2º turno',
    );
  });
});
