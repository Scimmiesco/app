import { TestBed } from '@angular/core/testing';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { VereadoresComponent } from './vereadores.component';

const secao: SecaoEnvelope<ParlamentarItem[]> = {
  titulo: 'Vereadores de Campo Grande',
  categoria: 'MANDATO LOCAL',
  status: 'oficial',
  fonte: 'tse_2024_abertos',
  ano: 2024,
  coletado_em: '2026-10-29',
  motivo: null,
  mandato: '2025-2028',
  dados: [
    {
      nome: 'MARQUINHOS TRAD',
      nome_urna: 'MARQUINHOS TRAD',
      partido: 'PDT',
      numero: '12345',
      votos: 8567,
      pct: 1.95,
      situacao: 'ELEITO',
      em_exercicio: true,
      mandato_fim: '2028-12-31',
      status_eleicao_2026: 'em_exercicio',
    },
  ],
};

describe('VereadoresComponent', () => {
  it('should render councilors with votes, party and in-office badge', () => {
    const fixture = TestBed.createComponent(VereadoresComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('MARQUINHOS TRAD');
    expect(el.textContent).toContain('8.567');
    expect(el.textContent).toContain('1,95%');
    expect(el.textContent).toContain('SIM');
    expect(el.querySelector('[data-testid="numero-candidato"]')?.textContent).toContain('12345');
  });
});
