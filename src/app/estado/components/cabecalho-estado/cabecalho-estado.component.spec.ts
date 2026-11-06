import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  EstadoCabecalhoDados,
  EstadoMeta,
  FonteMeta,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { CabecalhoEstadoComponent } from './cabecalho-estado.component';

const estado: EstadoMeta = {
  codigo_uf: 50,
  sigla: 'MS',
  nome: 'Mato Grosso do Sul',
  regiao: 'Centro-Oeste',
  capital: {
    nome: 'Campo Grande',
    codigo_ibge: 5002704,
  },
  total_municipios: 79,
  populacao: 2757013,
  eleitorado_total: 2032493,
  area_km2: 357145.53,
  densidade_hab_km2: 7.72,
};

const fonte: FonteMeta = {
  orgao: 'IBGE',
  titulo: 'Censo 2022',
  url: 'https://sidra.ibge.gov.br/',
  consultado_em: '2026-11-05',
  confianca: 'oficial',
};

const secao: SecaoEnvelope<EstadoCabecalhoDados> = {
  titulo: 'Panorama geral do Estado',
  categoria: 'O ESTADO',
  status: 'oficial',
  fonte: 'ibge_censo_2022',
  ano: 2022,
  coletado_em: '2026-11-05',
  motivo: null,
  dados: {
    nome: 'Mato Grosso do Sul',
    sigla: 'MS',
    populacao: 2757013,
    eleitorado: 2032493,
    total_municipios: 79,
    capital: 'Campo Grande',
    regiao: 'Centro-Oeste',
  },
};

describe('CabecalhoEstadoComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should render state name, sigla, population and capital link', () => {
    const fixture = TestBed.createComponent(CabecalhoEstadoComponent);
    fixture.componentRef.setInput('estado', estado);
    fixture.componentRef.setInput('secao', secao);
    fixture.componentRef.setInput('fonte', fonte);
    fixture.componentRef.setInput('siglaUf', 'MS');
    fixture.componentRef.setInput('estados', [
      {
        sigla: 'MS',
        codigo_uf: 50,
        nome: 'Mato Grosso do Sul',
        regiao: 'Centro-Oeste',
        arquivo: 'estados/MS.json',
        disponivel: true,
      },
    ]);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Mato Grosso do Sul (MS)');
    expect(
      el.querySelector('[data-testid="valor-metrica-populacao-estado"]')?.textContent,
    ).toContain('2.757.013');
    expect(
      el.querySelector('[data-testid="valor-metrica-eleitorado-estado"]')?.textContent,
    ).toContain('2.032.493');
    expect(
      el.querySelector('[data-testid="valor-metrica-municipios-estado"]')?.textContent,
    ).toContain('79');
    expect(el.querySelector('[data-testid="valor-metrica-capital-estado"]')?.textContent).toContain(
      'Campo Grande',
    );
    const linkCapital = el.querySelector('[data-testid="link-capital-cidade"]');
    expect(linkCapital).toBeTruthy();
    expect(linkCapital?.getAttribute('href')).toBe('/cidade/5002704');
  });

  it('should emit selected state when select changes', () => {
    const fixture = TestBed.createComponent(CabecalhoEstadoComponent);
    fixture.componentRef.setInput('estado', estado);
    fixture.componentRef.setInput('estados', [
      {
        sigla: 'MS',
        codigo_uf: 50,
        nome: 'Mato Grosso do Sul',
        regiao: 'Centro-Oeste',
        arquivo: 'estados/MS.json',
        disponivel: true,
      },
      {
        sigla: 'PR',
        codigo_uf: 41,
        nome: 'Paraná',
        regiao: 'Sul',
        arquivo: 'estados/PR.json',
        disponivel: true,
      },
    ]);
    fixture.detectChanges();

    let selecionado: string | undefined;
    fixture.componentInstance.estadoSelecionado.subscribe((sigla) => (selecionado = sigla));

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'PR';
    select.dispatchEvent(new Event('change'));

    expect(selecionado).toBe('PR');
  });
});
