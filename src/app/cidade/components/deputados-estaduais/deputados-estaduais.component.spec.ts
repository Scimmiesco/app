import { TestBed } from '@angular/core/testing';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { definirDataReferenciaMandato } from '../../../core/utils/status-parlamentar';
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
      mandato_inicio: '2027-02-01',
      mandato_fim: '2031-01-31',
      status_eleicao_2026: 'eleito',
    },
  ],
};

describe('DeputadosEstaduaisComponent', () => {
  afterEach(() => {
    definirDataReferenciaMandato(null);
  });

  it('should render state deputies with votes, percentage and dynamic mandate border', () => {
    definirDataReferenciaMandato('2026-11-08');
    const fixture = TestBed.createComponent(DeputadosEstaduaisComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('FULANO');
    expect(el.textContent).toContain('45.678');
    expect(el.textContent).toContain('2,31%');
    expect(el.querySelector('.tag-eleicao')?.textContent?.trim()).toBe('eleito');
    expect(el.querySelector('tbody tr')?.classList.contains('em-exercicio')).toBe(false);

    definirDataReferenciaMandato('2027-02-01');
    fixture.detectChanges();
    expect(el.querySelector('tbody tr')?.classList.contains('em-exercicio')).toBe(true);
    expect(el.textContent).toContain('Mandato: 2027-2031');
  });
});
