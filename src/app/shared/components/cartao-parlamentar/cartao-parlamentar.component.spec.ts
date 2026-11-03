import { TestBed } from '@angular/core/testing';
import { ParlamentarItem } from '../../../core/models/contrato.model';
import { ContextoTagParlamentar } from '../../../core/utils/status-parlamentar';
import { CartaoParlamentarComponent } from './cartao-parlamentar.component';

const base: ParlamentarItem = {
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
};

function render(
  parlamentar: ParlamentarItem,
  contexto: ContextoTagParlamentar,
  tagTestId: string | null = null,
): HTMLElement {
  const fixture = TestBed.createComponent(CartaoParlamentarComponent);
  fixture.componentRef.setInput('parlamentar', parlamentar);
  fixture.componentRef.setInput('contexto', contexto);
  fixture.componentRef.setInput('tagTestId', tagTestId);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CartaoParlamentarComponent', () => {
  it('should render photo, party, name and number', () => {
    const el = render(base, 'deputado-federal');
    expect(el.querySelector('.candidato-foto-tag app-candidato-avatar')).toBeTruthy();
    expect(el.querySelector('app-partido-badge')?.textContent).toContain('PT');
    expect(el.querySelector('.nome-candidato')?.textContent).toContain('CAMILA JARA');
    expect(el.querySelector('.nome-candidato')?.getAttribute('title')).toBe('CAMILA JARA');
    expect(el.querySelector('[data-testid="numero-candidato"]')?.textContent).toContain('1367');
  });

  it('should apply the reelected tag using the given context test id', () => {
    const el = render(base, 'governador', 'governador-status-eleicao');
    const tag = el.querySelector('.tag-eleicao');
    expect(tag?.textContent?.trim()).toBe('reeleito');
    expect(tag?.classList.contains('tag-reeleito')).toBe(true);
    expect(tag?.getAttribute('data-testid')).toBe('governador-status-eleicao');
  });

  it('should explain when the candidate did not run for the office', () => {
    const el = render(
      { ...base, numero: null, status_eleicao_2026: 'nao_concorreu_ao_cargo' },
      'deputado-federal',
    );
    const tag = el.querySelector('.tag-eleicao');
    expect(tag?.textContent).toContain('Não concorreu ao cargo');
    expect(tag?.classList.contains('tag-nao-concorreu')).toBe(true);
    expect(tag?.getAttribute('data-testid')).toBe('badge-nao-concorreu');
  });
});
