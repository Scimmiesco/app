import { TestBed } from '@angular/core/testing';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { DeputadosFederaisComponent } from './deputados-federais.component';

const secao: SecaoEnvelope<ParlamentarItem[]> = {
  titulo: 'Deputados federais de MS',
  categoria: 'ELEIÇÃO 2026',
  status: 'oficial',
  fonte: 'tse_2026_abertos',
  ano: 2026,
  coletado_em: '2026-10-29',
  motivo: null,
  pct_base: 'votos_nominais_do_cargo',
  mandato: '2027-2031',
  dados: [
    {
      nome: 'ROSE MODESTO',
      nome_urna: 'ROSE MODESTO',
      partido: 'UNIÃO',
      numero: '4444',
      votos: 124409,
      pct: 9.09,
      situacao: 'ELEITO POR QP',
      em_exercicio: false,
      mandato_fim: '2031-01-31',
      status_eleicao_2026: 'eleito',
      votos_nominais_mandato_atual: null,
    },
    {
      nome: 'CAMILA BAZACHI JARA MARZOCHI',
      nome_urna: 'CAMILA JARA',
      partido: 'PT',
      numero: '1367',
      votos: 154157,
      pct: 11.27,
      situacao: 'ELEITO POR QP',
      em_exercicio: true,
      mandato_fim: '2031-01-31',
      status_eleicao_2026: 'reeleito',
      votos_nominais_mandato_atual: 958,
    },
    {
      nome: 'Vander Loubet',
      nome_urna: 'Vander Loubet',
      partido: 'PT',
      numero: null,
      numero_historico: { numero: '1331', ano: 2022, cargo: 'DEPUTADO FEDERAL', fonte: 'tse' },
      votos: null,
      pct: null,
      situacao: null,
      em_exercicio: true,
      mandato_fim: '2031-01-31',
      status_eleicao_2026: 'nao_concorreu_ao_cargo',
      cargo_2026: 'Senador',
    },
  ],
};

describe('DeputadosFederaisComponent', () => {
  it('should order in-office first and explain not-reelected vs did-not-run', () => {
    const fixture = TestBed.createComponent(DeputadosFederaisComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const ordem = Array.from(el.querySelectorAll('tbody tr'));
    expect(ordem.length).toBe(3);
    expect(ordem[2].getAttribute('data-testid')).toBe('linha-deputado-rose modesto');

    const vander = el.querySelector('[data-testid="linha-deputado-vander loubet"]');
    const tagVander = vander?.querySelector('.tag-eleicao');
    expect(tagVander?.textContent?.trim()).toBe('outro cargo');
    expect(tagVander?.getAttribute('title')).toContain('Senador');
    expect(vander?.querySelector('.cell-situacao')).toBeNull();
    expect(vander?.textContent).toContain('Último:');
    expect(vander?.textContent).toContain('1331');
    expect(el.querySelector('[data-testid="legenda-status-deputados"]')?.textContent).toContain(
      'não reeleito = disputou e não foi eleito',
    );
    expect(el.querySelector('[data-testid="tabela-deputados"]')?.textContent).toContain('958');
  });
});
