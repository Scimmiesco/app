import { TestBed } from '@angular/core/testing';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { PrefeitoComponent } from './prefeito.component';

const secao: SecaoEnvelope<ParlamentarItem[]> = {
  titulo: 'Prefeito de Campo Grande',
  categoria: 'MANDATO LOCAL',
  status: 'oficial',
  fonte: 'tse_2024_abertos',
  ano: 2024,
  coletado_em: '2026-10-29',
  motivo: null,
  mandato: '2025-2028',
  dados: [
    {
      nome: 'ADRIANE LOPES',
      nome_urna: 'ADRIANE LOPES',
      partido: 'PP',
      numero: '11',
      votos: 222407,
      pct: 51.45,
      situacao: 'ELEITO',
      em_exercicio: true,
      mandato_fim: '2028-12-31',
      status_eleicao_2026: 'em_exercicio',
    },
  ],
};

describe('PrefeitoComponent', () => {
  it('should render the mayor card with photo container, votes and number', () => {
    const fixture = TestBed.createComponent(PrefeitoComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.candidato-foto-tag app-candidato-avatar')).toBeTruthy();
    expect(el.querySelector('.tag-eleicao')?.textContent?.trim()).toBe('em exercício');
    expect(el.querySelector('.nome-candidato')?.textContent).toContain('ADRIANE LOPES');
    expect(el.textContent).toContain('222.407');
    expect(el.querySelector('[data-testid="numero-candidato"]')?.textContent).toContain('11');
    expect(el.querySelector('.tag-eleicao')?.getAttribute('title')).toContain(
      'Mandato em exercício',
    );
  });
});
