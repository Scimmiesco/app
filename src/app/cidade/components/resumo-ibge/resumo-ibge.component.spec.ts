import { TestBed } from '@angular/core/testing';
import {
  FonteMeta,
  MapaMeta,
  ResumoIbgeDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { ResumoIbgeComponent } from './resumo-ibge.component';

const secao: SecaoEnvelope<ResumoIbgeDados> = {
  titulo: 'Demografia e renda',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_censo_2022',
  ano: 2022,
  coletado_em: '2026-10-29T16:17:22-0400',
  motivo: null,
  dados: {
    populacao: 898100,
    renda_media_pc: 2088.31,
    renda_mediana_pc: 1237.33,
    pct_urbana: 98.7,
    cor_raca_pct: { Branca: 45.1, Parda: 45.4 },
    area_territorial_km2: 8082.978,
    densidade_hab_km2: 111.11,
  },
};

const fonte: FonteMeta = {
  orgao: 'IBGE',
  titulo: 'Censo 2022',
  url: 'https://sidra.ibge.gov.br/',
  consultado_em: '2026-10-26',
  confianca: 'oficial',
};

const mapa: MapaMeta = {
  svg: 'geo/5002704.svg',
  viewBox: '-54.96842 20.12198 1.41173 1.50723',
  largura: 420,
  altura: 448,
  fonte: {
    orgao: 'IBGE',
    tipo: 'malha municipal (SVG oficial)',
    url: 'https://servicodados.ibge.gov.br/api/v3/malhas/municipios/5002704',
    sha256: 'abc',
    consultado_em: '2026-10-30',
  },
};

function render(): {
  fixture: ReturnType<typeof TestBed.createComponent<ResumoIbgeComponent>>;
  el: HTMLElement;
} {
  const fixture = TestBed.createComponent(ResumoIbgeComponent);
  fixture.componentRef.setInput('secao', secao);
  fixture.componentRef.setInput('fonte', fonte);
  fixture.componentRef.setInput('mapa', mapa);
  fixture.componentRef.setInput('nomeMunicipio', 'Campo Grande');
  fixture.detectChanges();
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

describe('ResumoIbgeComponent', () => {
  it('should render official socioeconomic metrics', () => {
    const { el } = render();
    expect(
      el.querySelector('[data-testid="card-metrica-area-territorial"]')?.textContent,
    ).toContain('8.082,978 km²');
    expect(
      el.querySelector('[data-testid="card-metrica-densidade-demografica"]')?.textContent,
    ).toContain('111,11 hab/km²');
    expect(el.querySelector('[data-testid="card-metrica-renda-media"]')?.textContent).toContain(
      'R$',
    );
    expect(
      el.querySelector('[data-testid="card-metrica-distribuicao-etnica"]')?.textContent,
    ).toContain('45,10%');
  });

  it('should toggle the official map panel', () => {
    const { fixture, el } = render();
    const componente = fixture.componentInstance;
    const painel = el.querySelector('[data-testid="card-mapa-oficial"]');
    expect(painel?.classList.contains('painel-aberto')).toBe(false);

    (el.querySelector('[data-testid="botao-toggle-mapa"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(componente.mostrarMapa()).toBe(true);
    expect(painel?.classList.contains('painel-aberto')).toBe(true);
    expect(el.querySelector('[data-testid="botao-toggle-mapa"]')?.textContent).toContain(
      'Ocultar Mapa',
    );
    expect(
      (el.querySelector('[data-testid="mapa-svg-elemento"]') as HTMLImageElement).getAttribute(
        'src',
      ),
    ).toContain('geo/5002704.svg');
    expect(
      (el.querySelector('[data-testid="mapa-link-fonte-ibge"]') as HTMLAnchorElement).getAttribute(
        'href',
      ),
    ).toContain('servicodados.ibge.gov.br');
  });
});
