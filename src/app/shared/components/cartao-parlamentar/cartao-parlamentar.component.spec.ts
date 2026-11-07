import { TestBed } from '@angular/core/testing';
import { ParlamentarItem } from '../../../core/models/contrato.model';
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

function render(parlamentar: ParlamentarItem, anoPleito = 2026): HTMLElement {
  const fixture = TestBed.createComponent(CartaoParlamentarComponent);
  fixture.componentRef.setInput('parlamentar', parlamentar);
  fixture.componentRef.setInput('anoPleito', anoPleito);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CartaoParlamentarComponent', () => {
  it('should render photo, party, name and number', () => {
    const el = render(base);
    expect(el.querySelector('.candidato-foto-tag app-candidato-avatar')).toBeTruthy();
    expect(el.querySelector('app-partido-badge')?.textContent).toContain('PT');
    expect(el.querySelector('.nome-candidato')?.textContent).toContain('CAMILA JARA');
    expect(el.querySelector('.nome-candidato')?.getAttribute('title')).toBe('CAMILA JARA');
    expect(el.querySelector('[data-testid="numero-candidato"]')?.textContent).toContain('1367');
  });

  it('should show the unified status badge with accessible description', () => {
    const el = render(base);
    const tag = el.querySelector('.tag-eleicao');
    expect(tag?.textContent?.trim()).toBe('reeleito');
    expect(tag?.classList.contains('tag-reeleito')).toBe(true);
    expect(tag?.getAttribute('title')).toContain('Reeleito no pleito de 2026');
    expect(tag?.getAttribute('title')).toContain('ELEITO POR QP');
    expect(tag?.getAttribute('title')).toContain('Mandato até 31/01/2031');
    expect(tag?.getAttribute('aria-label')).toBe(tag?.getAttribute('title'));
  });

  it('should distinguish suplente from not reelected', () => {
    const el = render({ ...base, status_eleicao_2026: 'nao_reeleito', situacao: 'SUPLENTE' });
    const tag = el.querySelector('.tag-eleicao');
    expect(tag?.textContent?.trim()).toBe('suplente');
    expect(tag?.classList.contains('tag-suplente')).toBe(true);
    expect(tag?.getAttribute('title')).toContain('ficou como suplente');
    expect(
      el.querySelector('.candidato-foto-tag')?.classList.contains('candidato-nao-eleito'),
    ).toBe(true);
  });

  it('should explain when the candidate did not run for the office', () => {
    const el = render({
      ...base,
      numero: null,
      status_eleicao_2026: 'nao_concorreu_ao_cargo',
      cargo_2026: 'Senador',
      situacao: null,
    });
    const tag = el.querySelector('.tag-eleicao');
    expect(tag?.textContent?.trim()).toBe('não concorreu');
    expect(tag?.classList.contains('tag-nao-concorreu')).toBe(true);
    expect(tag?.getAttribute('data-testid')).toBe('badge-nao-concorreu');
    expect(tag?.getAttribute('title')).toContain('Senador');
  });

  it('should render em exercício for a current mandate', () => {
    const el = render({ ...base, status_eleicao_2026: 'em_exercicio' }, 2024);
    const tag = el.querySelector('.tag-eleicao');
    expect(tag?.textContent?.trim()).toBe('em exercício');
    expect(tag?.classList.contains('tag-em-exercicio')).toBe(true);
  });
});
