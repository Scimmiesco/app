import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CidadeComponent } from './cidade.component';
import { DataService } from '../core/services/data.service';
import { IndiceCidades, MunicipioSnapshot } from '../core/models/contrato.model';

describe('CidadeComponent', () => {
  let component: CidadeComponent;
  let fixture: ComponentFixture<CidadeComponent>;

  const mockSnapshot: MunicipioSnapshot = {
    schema_version: '0.3.0',
    gerado_em: '2026-10-29T16:17:22-0400',
    municipio: {
      codigo_ibge: 5002704,
      codigo_tse: '90514',
      nome: 'Campo Grande',
      uf: 'MS',
    },
    fontes: {
      ibge_censo_2022: {
        orgao: 'IBGE',
        titulo: 'Censo 2022',
        url: 'https://sidra.ibge.gov.br/',
        consultado_em: '2026-10-26',
        confianca: 'oficial',
      },
      tse_2026_abertos: {
        orgao: 'TSE',
        titulo: 'Arquivos abertos 2026',
        url: 'https://cdn.tse.jus.br/',
        consultado_em: '2026-10-29',
        confianca: 'oficial',
      },
    },
    secoes: {
      cabecalho: {
        titulo: 'Cidade',
        status: 'oficial',
        fonte: 'ibge_censo_2022',
        ano: 2022,
        coletado_em: '2026-10-29T16:17:22-0400',
        motivo: null,
        dados: {
          nome: 'Campo Grande',
          uf: 'MS',
          populacao: 898100,
        },
      },
      resumo_ibge_censo: {
        titulo: 'Resumo do município (IBGE)',
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
        },
      },
      deputados_federais: {
        titulo: 'Deputados federais (MS) — mandato e eleição 2026',
        status: 'oficial',
        fonte: 'tse_2026_abertos',
        ano: 2026,
        coletado_em: '2026-10-29T16:17:22-0400',
        motivo: null,
        pct_base: 'votos_nominais_do_cargo',
        mandato: '2027-2031',
        dados: [
          {
            nome: 'ROSE MODESTO',
            nome_urna: 'ROSE MODESTO',
            partido: 'UNIÃO',
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
            votos: 154157,
            pct: 11.27,
            situacao: 'ELEITO POR QP',
            em_exercicio: true,
            mandato_fim: '2031-01-31',
            status_eleicao_2026: 'reeleito',
            votos_nominais_mandato_atual: 958,
          },
        ],
      },
    },
    pendencias: [],
  };

  const mockIndice: IndiceCidades = {
    schema_version: '0.3.0',
    gerado_em: '2026-10-29T16:17:22-0400',
    cidades: [
      {
        codigo_ibge: 5002704,
        codigo_tse: '90514',
        nome: 'Campo Grande',
        uf: 'MS',
        arquivo: 'municipios/5002704.json',
        disponivel: true,
      },
    ],
  };

  beforeEach(async () => {
    const mockDataService = {
      getCidade: () => of(mockSnapshot),
      getIndiceCidades: () => of(mockIndice),
    };

    await TestBed.configureTestingModule({
      imports: [CidadeComponent],
      providers: [provideRouter([]), { provide: DataService, useValue: mockDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render municipal header from snapshot data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Campo Grande / MS');
    expect(compiled.textContent).toContain('898.100 hab.');
  });

  it('should display official source badges with links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const badges = compiled.querySelectorAll('.badge-oficial');
    expect(badges.length).toBeGreaterThan(0);
    expect(compiled.textContent).toContain('IBGE · Censo 2022');
  });

  it('should order deputados with em_exercicio=true first', () => {
    const ordenados = component.deputadosOrdenados();
    expect(ordenados.length).toBe(2);
    expect(ordenados[0].nome_urna).toBe('CAMILA JARA');
    expect(ordenados[0].em_exercicio).toBe(true);
    expect(ordenados[1].nome_urna).toBe('ROSE MODESTO');
    expect(ordenados[1].em_exercicio).toBe(false);
  });

  it('should render federal deputies table with mandate end and votes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('CAMILA JARA');
    expect(compiled.textContent).toContain('31/01/2031');
    expect(compiled.textContent).toContain('958');
  });
});
