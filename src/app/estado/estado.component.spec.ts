import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { EstadoComponent } from './estado.component';
import { EstadoSnapshot, IndiceEstados } from '../core/models/contrato.model';

const mockEstadoSnapshot: EstadoSnapshot = {
  schema_version: '0.12.0',
  gerado_em: '2026-11-05T20:00:00-0400',
  estado: {
    codigo_uf: 50,
    sigla: 'MS',
    nome: 'Mato Grosso do Sul',
    regiao: 'Centro-Oeste',
    capital: { nome: 'Campo Grande', codigo_ibge: 5002704 },
    total_municipios: 79,
    populacao: 2757013,
    eleitorado_total: 2032493,
    area_km2: 357145.53,
    densidade_hab_km2: 7.72,
  },
  fontes: {
    ibge: {
      orgao: 'IBGE',
      titulo: 'Censo 2022',
      url: 'https://sidra.ibge.gov.br/',
      consultado_em: '2026-11-05',
      confianca: 'oficial',
    },
  },
  secoes: {
    cabecalho: {
      titulo: 'Panorama geral do Estado (MS)',
      status: 'oficial',
      fonte: 'ibge',
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
    },
    governador: {
      titulo: 'Governador de MS',
      status: 'oficial',
      fonte: 'ibge',
      ano: 2022,
      coletado_em: '2026-11-05',
      motivo: null,
      dados: [
        {
          nome: 'Eduardo Corrêa Riedel',
          nome_urna: 'Eduardo Riedel',
          partido: 'PSDB',
          em_exercicio: true,
          mandato_fim: '2026-12-31',
          status_eleicao_2026: 'em_exercicio',
          votos: 808210,
        },
      ],
    },
    senadores: {
      titulo: 'Senadores de MS',
      status: 'oficial',
      fonte: 'ibge',
      ano: 2022,
      coletado_em: '2026-11-05',
      motivo: null,
      dados: [
        {
          nome: 'Tereza Cristina Dias',
          nome_urna: 'Tereza Cristina',
          partido: 'PP',
          em_exercicio: true,
          mandato_fim: '2030-12-31',
          status_eleicao_2026: 'em_exercicio',
          votos: 829149,
        },
      ],
    },
    deputados_federais: {
      titulo: 'Deputados Federais de MS',
      status: 'oficial',
      fonte: 'ibge',
      ano: 2022,
      coletado_em: '2026-11-05',
      motivo: null,
      dados: [
        {
          nome: 'Marcos Pollon',
          nome_urna: 'Marcos Pollon',
          partido: 'PL',
          em_exercicio: true,
          mandato_fim: '2026-12-31',
          status_eleicao_2026: 'em_exercicio',
          votos: 149644,
        },
      ],
    },
    deputados_estaduais: {
      titulo: 'Deputados Estaduais de MS',
      status: 'oficial',
      fonte: 'ibge',
      ano: 2022,
      coletado_em: '2026-11-05',
      motivo: null,
      dados: [
        {
          nome: 'Mara Caseiro',
          nome_urna: 'Mara Caseiro',
          partido: 'PSDB',
          em_exercicio: true,
          mandato_fim: '2026-12-31',
          status_eleicao_2026: 'em_exercicio',
          votos: 49512,
        },
      ],
    },
    municipios: {
      titulo: 'Municípios em Destaque — MS',
      status: 'oficial',
      fonte: 'ibge',
      ano: 2022,
      coletado_em: '2026-11-05',
      motivo: null,
      dados: [
        {
          codigo_ibge: 5002704,
          nome: 'Campo Grande',
          populacao: 898100,
          disponivel: true,
        },
      ],
    },
  },
  pendencias: [],
};

const mockIndiceEstados: IndiceEstados = {
  schema_version: '0.12.0',
  gerado_em: '2026-11-05T20:00:00-0400',
  estados: [
    {
      sigla: 'MS',
      codigo_uf: 50,
      nome: 'Mato Grosso do Sul',
      regiao: 'Centro-Oeste',
      arquivo: 'estados/MS.json',
      disponivel: true,
    },
  ],
};

describe('EstadoComponent', () => {
  let fixture: ComponentFixture<EstadoComponent>;
  let httpTesting: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EstadoComponent);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should render skeleton while loading and full sections once loaded', () => {
    fixture.componentRef.setInput('uf', 'MS');
    fixture.detectChanges();

    // While loading:
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="container-loading-estado"]')).toBeTruthy();

    const reqSnap = httpTesting.expectOne('/data/estados/MS.json');
    const reqInd = httpTesting.expectOne('/data/indice-estados.json');

    reqSnap.flush(mockEstadoSnapshot);
    reqInd.flush(mockIndiceEstados);
    fixture.detectChanges();

    // After loading:
    expect(el.querySelector('[data-testid="container-loading-estado"]')).toBeNull();
    expect(el.querySelector('[data-testid="titulo-estado"]')?.textContent).toContain(
      'Mato Grosso do Sul (MS)',
    );
    expect(el.querySelector('[data-testid="card-governador"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="card-senadores"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="card-deputados-federais"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="card-deputados-estaduais"]')).toBeTruthy();
    expect(el.querySelector('[data-testid="card-municipios-estado"]')).toBeTruthy();
  });

  it('should navigate to new state when navegarParaEstado is called', () => {
    fixture.componentRef.setInput('uf', 'MS');
    fixture.detectChanges();

    const reqSnap = httpTesting.expectOne('/data/estados/MS.json');
    const reqInd = httpTesting.expectOne('/data/indice-estados.json');
    reqSnap.flush(mockEstadoSnapshot);
    reqInd.flush(mockIndiceEstados);
    fixture.detectChanges();

    const spyNavigate = vi.spyOn(router, 'navigate');
    fixture.componentInstance.navegarParaEstado('PR');

    expect(spyNavigate).toHaveBeenCalledWith(['/estado', 'PR']);
  });
});
