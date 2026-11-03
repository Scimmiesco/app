import { TestBed } from '@angular/core/testing';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { GovernadorComponent } from './governador.component';

const governador: ParlamentarItem = {
  nome: 'EDUARDO RIEDEL',
  nome_urna: 'EDUARDO RIEDEL',
  partido: 'PP',
  numero: '11',
  votos: 914323,
  pct: 67.07,
  situacao: 'ELEITO',
  em_exercicio: true,
  mandato_fim: '2030-12-31',
  status_eleicao_2026: 'reeleito',
};

const secao: SecaoEnvelope<ParlamentarItem[]> = {
  titulo: 'Governador de MS',
  categoria: 'ELEIÇÃO 2026',
  status: 'oficial',
  fonte: 'tse_2026_abertos',
  ano: 2026,
  coletado_em: '2026-10-29',
  motivo: null,
  pct_base: 'votos_nominais_do_cargo',
  mandato: '2027-2030',
  nota: 'Reeleito em 2026.',
  dados: [governador],
};

describe('GovernadorComponent', () => {
  it('should render the elected governor table with mandate and source', () => {
    const fixture = TestBed.createComponent(GovernadorComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.componentRef.setInput('fonte', {
      orgao: 'TSE',
      titulo: 'Arquivos abertos 2026',
      url: 'https://dadosabertos.tse.jus.br/',
      consultado_em: '2026-10-29',
      confianca: 'oficial',
    });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const card = el.querySelector('[data-testid="card-governador"]');
    expect(card?.textContent).toContain('EDUARDO RIEDEL');
    expect(card?.textContent).toContain('914.323');
    expect(card?.textContent).toContain('67,07%');
    expect(card?.textContent).toContain('31/12/2030');
    expect(card?.textContent).toContain('reeleito');
    expect(card?.textContent).toContain('SIM');
    expect(card?.querySelector('[data-testid="governador-badge-mandato"]')?.textContent).toContain(
      'Mandato: 2027-2030',
    );
    expect(card?.querySelector('[data-testid="governador-nota"]')?.textContent).toContain(
      'Reeleito em 2026.',
    );
    expect(
      card?.querySelector('[data-testid="tabela-governador"] th:last-child')?.textContent?.trim(),
    ).toBe('Situação TSE');
  });
});
