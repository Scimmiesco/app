import { TestBed } from '@angular/core/testing';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { DeputadosEstaduaisComponent } from './deputados-estaduais.component';

const secao: SecaoEnvelope<ParlamentarItem[]> = {
  titulo: 'Deputados estaduais de MS',
  categoria: 'ELEIÇÃO 2026',
  status: 'oficial',
  fonte: 'tse_2026_abertos',
  ano: 2026,
  coletado_em: '2026-10-29',
  motivo: null,
  mandato: '2027-2031',
  dados: [
    {
      nome: 'FULANO DE TAL',
      nome_urna: 'FULANO',
      partido: 'PSDB',
      numero: '45123',
      votos: 45678,
      pct: 2.31,
      situacao: 'ELEITO',
      em_exercicio: false,
      mandato_fim: '2031-01-31',
      status_eleicao_2026: 'eleito',
    },
  ],
};

describe('DeputadosEstaduaisComponent', () => {
  it('should render state deputies with votes, percentage and elected tag', () => {
    const fixture = TestBed.createComponent(DeputadosEstaduaisComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('FULANO');
    expect(el.textContent).toContain('45.678');
    expect(el.textContent).toContain('2,31%');
    expect(el.querySelector('.tag-eleicao')?.textContent?.trim()).toBe('eleito');
    expect(el.textContent).toContain('Mandato: 2027-2031');
  });
});
