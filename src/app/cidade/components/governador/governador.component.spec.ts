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
    const tag = card?.querySelector('.tag-eleicao');
    expect(tag?.textContent?.trim()).toBe('reeleito');
    expect(tag?.getAttribute('title')).toContain('ELEITO');
    expect(card?.querySelector('[data-testid="governador-badge-mandato"]')?.textContent).toContain(
      'Mandato: 2027-2030',
    );
    expect(card?.querySelector('[data-testid="governador-nota"]')?.textContent).toContain(
      'Reeleito em 2026.',
    );
    expect(
      card?.querySelector('[data-testid="tabela-governador"] th:last-child')?.textContent?.trim(),
    ).toBe('Fim do Mandato');
  });

  it('should render the newly elected governor first and the governor in office on the line below when there is a change of office', () => {
    const moroEleito: ParlamentarItem = {
      nome: 'SERGIO FERNANDO MORO',
      nome_urna: 'SERGIO MORO',
      partido: 'PL',
      numero: '22',
      votos: 3127911,
      pct: 50.1,
      situacao: 'ELEITO',
      em_exercicio: false,
      mandato_inicio: '2027-01-01',
      mandato_fim: '2030-12-31',
      status_eleicao_2026: 'eleito',
    };

    const ratinhoEmExercicio: ParlamentarItem = {
      nome: 'CARLOS ROBERTO MASSA JUNIOR',
      nome_urna: 'CARLOS MASSA RATINHO JUNIOR',
      partido: 'PSD',
      numero: null,
      numero_historico: {
        numero: '55',
        ano: 2022,
        cargo: 'GOVERNADOR',
        fonte: 'tse_candidatos_2022',
      },
      votos: null,
      pct: null,
      situacao: 'em exercício',
      em_exercicio: true,
      mandato_inicio: '2023-01-01',
      mandato_fim: '2026-12-31',
      status_eleicao_2026: 'em_exercicio',
    };

    const secaoTroca: SecaoEnvelope<ParlamentarItem[]> = {
      titulo: 'Governador do Paraná',
      categoria: 'ELEIÇÃO 2026',
      status: 'oficial',
      fonte: 'tse_2026_abertos',
      ano: 2026,
      coletado_em: '2026-11-05',
      motivo: null,
      pct_base: 'votos_nominais_do_cargo',
      mandato: '2027-2030',
      nota: 'Sergio Moro assume em 01/01/2027. Carlos Massa Ratinho Junior permanece em exercício até 31/12/2026.',
      // Mesmo que o array venha desordenado (em_exercicio primeiro):
      dados: [ratinhoEmExercicio, moroEleito],
    };

    const fixture = TestBed.createComponent(GovernadorComponent);
    fixture.componentRef.setInput('secao', secaoTroca);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const linhas = el.querySelectorAll('[data-testid="tabela-governador"] tbody tr');
    expect(linhas.length).toBe(2);

    // Linha 1 (topo): Governador Eleito 2026
    const linha1 = linhas[0];
    expect(linha1.textContent).toContain('SERGIO MORO');
    expect(linha1.textContent).toContain('3.127.911');
    expect(linha1.textContent).toContain('50,10%');
    expect(linha1.textContent).toContain('31/12/2030');
    expect(linha1.querySelector('.tag-eleicao')?.textContent?.trim()).toBe('eleito');

    // Linha 2 (linha abaixo): Governador em exercício
    const linha2 = linhas[1];
    expect(linha2.textContent).toContain('CARLOS MASSA RATINHO JUNIOR');
    expect(linha2.textContent).toContain('—'); // sem votos no pleito 2026
    expect(linha2.textContent).toContain('31/12/2026');
    expect(linha2.querySelector('.tag-eleicao')?.textContent?.trim()).toBe('em exercício');
    expect(linha2.classList.contains('em-exercicio')).toBe(true);
  });
});
