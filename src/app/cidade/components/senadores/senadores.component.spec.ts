import { TestBed } from '@angular/core/testing';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { SenadoresComponent } from './senadores.component';

const secao: SecaoEnvelope<ParlamentarItem[]> = {
  titulo: 'Senadores de MS',
  categoria: 'ELEIÇÃO 2026',
  status: 'oficial',
  fonte: 'senado_api',
  ano: 2026,
  coletado_em: '2026-10-29',
  motivo: null,
  dados: [
    {
      nome: 'TEREZA CRISTINA',
      nome_urna: 'TEREZA CRISTINA',
      partido: 'PP',
      numero: null,
      numero_historico: { numero: '111', ano: 2022, cargo: 'SENADOR', fonte: 'tse' },
      votos: null,
      pct: null,
      situacao: 'EM EXERCÍCIO',
      em_exercicio: true,
      mandato_inicio: '2023-02-01',
      mandato_fim: '2031-01-31',
      status_eleicao_2026: 'em_exercicio',
    },
    {
      nome: 'SORAYA THRONICKE',
      nome_urna: 'SORAYA',
      partido: 'PSB',
      numero: '400',
      votos: 361920,
      pct: 13.88,
      situacao: 'ELEITO',
      em_exercicio: true,
      mandato_fim: '2031-01-31',
      status_eleicao_2026: 'eleito',
    },
  ],
};

describe('SenadoresComponent', () => {
  it('should render current and historical ballot numbers without splitting elected lists', () => {
    const fixture = TestBed.createComponent(SenadoresComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const tereza = el.querySelector('[data-testid="linha-senador-tereza cristina"]');
    const soraya = el.querySelector('[data-testid="linha-senador-soraya"]');
    expect(tereza?.textContent).toContain('Último:');
    expect(tereza?.textContent).toContain('111');
    expect(tereza?.textContent).toContain('2022');
    expect(soraya?.textContent).toContain('400');
    expect(soraya?.textContent).not.toContain('Último');
    // A tabela de senadores não possui coluna de votos: apenas mandato e situação.
    expect(soraya?.textContent).toContain('31/01/2031');
  });
});
