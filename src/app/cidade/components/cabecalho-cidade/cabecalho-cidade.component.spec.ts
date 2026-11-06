import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  CabecalhoDados,
  FonteMeta,
  MunicipioMeta,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { CabecalhoCidadeComponent } from './cabecalho-cidade.component';

const municipio: MunicipioMeta = {
  codigo_ibge: 5002704,
  codigo_tse: '90514',
  nome: 'Campo Grande',
  uf: 'MS',
};

const fonte: FonteMeta = {
  orgao: 'IBGE',
  titulo: 'Censo 2022',
  url: 'https://sidra.ibge.gov.br/',
  consultado_em: '2026-10-26',
  confianca: 'oficial',
};

const secao: SecaoEnvelope<CabecalhoDados> = {
  titulo: 'Panorama geral',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_censo_2022',
  ano: 2022,
  coletado_em: '2026-10-29T16:17:22-0400',
  motivo: null,
  dados: { nome: 'Campo Grande', uf: 'MS', populacao: 898100 },
};

function render(): HTMLElement {
  const fixture = TestBed.createComponent(CabecalhoCidadeComponent);
  fixture.componentRef.setInput('municipio', municipio);
  fixture.componentRef.setInput('secao', secao);
  fixture.componentRef.setInput('fonte', fonte);
  fixture.componentRef.setInput('codigoIbge', '5002704');
  fixture.componentRef.setInput('cidades', [
    {
      codigo_ibge: 5002704,
      codigo_tse: '90514',
      nome: 'Campo Grande',
      uf: 'MS',
      arquivo: 'municipios/5002704.json',
      disponivel: true,
    },
  ]);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CabecalhoCidadeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should render city title, codes and population and link to state', () => {
    const el = render();
    expect(el.querySelector('h1')?.textContent).toContain('Campo Grande / MS');
    expect(el.querySelector('[data-testid="rotulo-codigos-ibge-tse"]')?.textContent).toContain(
      '5002704',
    );
    expect(el.querySelector('[data-testid="valor-metrica-populacao"]')?.textContent).toContain(
      '898.100',
    );
    expect(el.querySelector('[data-testid="cabecalho-link-fonte"]')?.getAttribute('href')).toBe(
      fonte.url,
    );
    const linkEstado = el.querySelector('[data-testid="btn-alternar-estado"]');
    expect(linkEstado).toBeTruthy();
    expect(linkEstado?.textContent).toContain('Estadual (MS)');
    expect(linkEstado?.getAttribute('href')).toBe('/estado/MS');

    expect(el.querySelector('[data-testid="kicker-esfera-cidade"]')?.textContent).toContain(
      'ESFERA MUNICIPAL',
    );
    expect(el.querySelector('[data-testid="badge-esfera-cidade"]')?.textContent).toContain(
      'Municipal',
    );
    expect(
      el.querySelector('[data-testid="container-seletor-esfera-cidade"]')?.textContent,
    ).toContain('Mudar Município');
  });

  it('should emit the selected city code', () => {
    const fixture = TestBed.createComponent(CabecalhoCidadeComponent);
    fixture.componentRef.setInput('municipio', municipio);
    fixture.componentRef.setInput('secao', secao);
    fixture.componentRef.setInput('cidades', [
      {
        codigo_ibge: 5002704,
        codigo_tse: '90514',
        nome: 'Campo Grande',
        uf: 'MS',
        arquivo: 'municipios/5002704.json',
        disponivel: true,
      },
    ]);
    const emitidos: string[] = [];
    fixture.componentInstance.cidadeSelecionada.subscribe((codigo) => emitidos.push(codigo));
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      '[data-testid="select-cidade"]',
    ) as HTMLSelectElement;
    select.value = '5002704';
    select.dispatchEvent(new Event('change'));

    expect(emitidos).toEqual(['5002704']);
  });

  it('should mark the active city option as selected when multiple cities are available', () => {
    const fixture = TestBed.createComponent(CabecalhoCidadeComponent);
    fixture.componentRef.setInput('municipio', {
      codigo_ibge: 4106902,
      codigo_tse: '75353',
      nome: 'Curitiba',
      uf: 'PR',
    });
    fixture.componentRef.setInput('codigoIbge', '4106902');
    fixture.componentRef.setInput('cidades', [
      {
        codigo_ibge: 5002704,
        codigo_tse: '90514',
        nome: 'Campo Grande',
        uf: 'MS',
        arquivo: 'municipios/5002704.json',
        disponivel: true,
      },
      {
        codigo_ibge: 2211001,
        codigo_tse: '12190',
        nome: 'Teresina',
        uf: 'PI',
        arquivo: 'municipios/2211001.json',
        disponivel: true,
      },
      {
        codigo_ibge: 4106902,
        codigo_tse: '75353',
        nome: 'Curitiba',
        uf: 'PR',
        arquivo: 'municipios/4106902.json',
        disponivel: true,
      },
    ]);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      '[data-testid="select-cidade"]',
    ) as HTMLSelectElement;
    expect(select.value).toBe('4106902');

    const opcaoCg = fixture.nativeElement.querySelector(
      '[data-testid="opcao-cidade-5002704"]',
    ) as HTMLOptionElement;
    const opcaoCtba = fixture.nativeElement.querySelector(
      '[data-testid="opcao-cidade-4106902"]',
    ) as HTMLOptionElement;

    expect(opcaoCg.selected).toBe(false);
    expect(opcaoCtba.selected).toBe(true);
  });
});
