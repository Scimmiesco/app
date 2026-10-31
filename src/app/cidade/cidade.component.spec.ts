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
    schema_version: '0.5.0',
    gerado_em: '2026-10-31T20:45:00-0400',
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
        url: 'https://dadosabertos.tse.jus.br/dataset/resultados-2026',
        consultado_em: '2026-10-29',
        confianca: 'oficial',
      },
      ibge_pib_2023: {
        orgao: 'IBGE',
        titulo: 'PIB municipal 2023',
        url: 'https://sidra.ibge.gov.br/tabela/5938',
        consultado_em: '2026-10-26',
        confianca: 'oficial',
      },
      tse_2026_1t: {
        orgao: 'TSE',
        titulo: 'Votação por seção 2026 - 1º turno (Presidente)',
        url: 'https://resultados.tse.jus.br/',
        consultado_em: '2026-10-06',
        confianca: 'oficial',
      },
      tse_2026_2t: {
        orgao: 'TSE',
        titulo: 'Votação por seção 2026 - 2º turno (Presidente)',
        url: 'https://resultados.tse.jus.br/',
        consultado_em: '2026-10-27',
        confianca: 'oficial',
      },
    },
    mapa: {
      svg: 'geo/5002704.svg',
      viewBox: '-54.96842 20.12198 1.41173 1.50723',
      largura: 420,
      altura: 448,
      fonte: {
        orgao: 'IBGE',
        tipo: 'malha municipal (SVG oficial)',
        url: 'https://servicodados.ibge.gov.br/api/v3/malhas/municipios/5002704',
        sha256: 'fbd9583aec0d2a9a6749bd6e8b1965081238663962b973a0c553fb964ef375b3',
        consultado_em: '2026-10-30',
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
      resumo_economia: {
        titulo: 'Economia (IBGE)',
        status: 'oficial',
        fonte: 'ibge_pib_2023',
        ano: 2023,
        coletado_em: '2026-10-26',
        motivo: null,
        dados: {
          pib_total: 34731175000,
          pib_per_capita: 38671.84,
        },
      },
      eleicao_2026_1t: {
        titulo: 'Eleição presidencial 2026 — 1º turno (TSE)',
        status: 'oficial',
        fonte: 'tse_2026_1t',
        ano: 2026,
        coletado_em: '2026-10-30T20:07:33-0400',
        motivo: null,
        dados: {
          eleitores_aptos: 640427,
          comparecimento_abs: 512243,
          comparecimento_pct: 79.98,
          validos: 493722,
          lula: 159856,
          flavio: 289672,
          outros: 44194,
          pct_lula: 32.38,
          pct_flavio: 58.67,
          locais: 237,
          secoes: 2189,
          secoes_apuradas: 2189,
          total_secoes: 2189,
        },
      },
      eleicao_2026_2t: {
        titulo: 'Eleição presidencial 2026 — 2º turno (TSE)',
        status: 'oficial',
        fonte: 'tse_2026_2t',
        ano: 2026,
        coletado_em: '2026-10-31T20:45:00-0400',
        motivo: null,
        dados: {
          eleitores_aptos: 640427,
          comparecimento_abs: 527124,
          comparecimento_pct: 82.31,
          validos: 511988,
          lula: 199121,
          flavio: 312867,
          outros: 0,
          pct_lula: 38.89,
          pct_flavio: 61.11,
          locais: 237,
          secoes: 2189,
          secoes_apuradas: 2189,
          total_secoes: 2189,
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
      governador: {
        titulo: 'Governador (2026)',
        status: 'oficial',
        fonte: 'tse_2026_abertos',
        ano: 2026,
        coletado_em: '2026-10-31T19:00:25-0400',
        motivo: null,
        pct_base: 'votos_nominais_do_cargo',
        mandato: '2027-2030',
        nota: 'Reeleito em 2026. Exercício do mandato atual 2023-2026 (TSE 2022); novo mandato 2027-2030 (TSE 2026).',
        dados: [
          {
            nome: 'EDUARDO CORREA RIEDEL',
            nome_urna: 'EDUARDO RIEDEL',
            partido: 'PP',
            votos: 914323,
            pct: 67.07,
            situacao: 'ELEITO',
            em_exercicio: true,
            mandato_inicio: '2027-01-01',
            mandato_fim: '2030-12-31',
            status_eleicao_2026: 'reeleito',
            votos_nominais_mandato_atual: null,
            motivo_sem_votos: null,
          },
        ],
      },
    },
    pendencias: [],
  };

  const mockIndice: IndiceCidades = {
    schema_version: '0.5.0',
    gerado_em: '2026-10-31T20:45:00-0400',
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

  let currentSnapshot: MunicipioSnapshot = mockSnapshot;

  beforeEach(async () => {
    currentSnapshot = mockSnapshot;
    const mockDataService = {
      getCidade: () => of(currentSnapshot),
      getIndiceCidades: () => of(mockIndice),
      limparCacheCidade: () => undefined,
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

  it('should render official SVG map (US-08) integrated within the resumo section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cardResumo = compiled.querySelector('[data-testid="card-resumo-ibge"]');
    expect(cardResumo).toBeTruthy();

    const cardMapa = cardResumo?.querySelector('[data-testid="card-mapa-oficial"]');
    expect(cardMapa).toBeTruthy();

    const imgMapa = cardResumo?.querySelector(
      '[data-testid="mapa-svg-elemento"]',
    ) as HTMLImageElement | null;
    expect(imgMapa).toBeTruthy();
    expect(imgMapa?.getAttribute('src')).toContain('geo/5002704.svg');

    const linkIbge = cardResumo?.querySelector(
      '[data-testid="mapa-link-fonte-ibge"]',
    ) as HTMLAnchorElement | null;
    expect(linkIbge?.getAttribute('href')).toContain('servicodados.ibge.gov.br');
  });

  it('should toggle map expansion inside resumo section when clicking toggle button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const botaoToggle = compiled.querySelector(
      '[data-testid="botao-toggle-mapa"]',
    ) as HTMLButtonElement | null;
    expect(botaoToggle).toBeTruthy();
    expect(component.mostrarMapa()).toBe(false);

    botaoToggle?.click();
    fixture.detectChanges();
    expect(component.mostrarMapa()).toBe(true);
    expect(botaoToggle?.textContent).toContain('Ocultar Mapa');

    const painelMapa = compiled.querySelector('[data-testid="card-mapa-oficial"]');
    expect(painelMapa?.classList.contains('painel-aberto')).toBe(true);

    botaoToggle?.click();
    fixture.detectChanges();
    expect(component.mostrarMapa()).toBe(false);
    expect(painelMapa?.classList.contains('painel-aberto')).toBe(false);
  });

  it('should render presidential election tabs and navigate between 1t, 2t and comparativo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cardPres = compiled.querySelector('[data-testid="card-eleicao-presidencial"]');
    expect(cardPres).toBeTruthy();

    const abas = compiled.querySelector('[data-testid="abas-eleicao-presidencial"]');
    expect(abas).toBeTruthy();
    expect(abas?.classList.contains('container-default')).toBe(true);
    expect(abas?.classList.contains('flex-nowrap')).toBe(true);
    expect(abas?.classList.contains('shrink-0')).toBe(true);

    const aba1t = compiled.querySelector('[data-testid="aba-1t"]') as HTMLButtonElement | null;
    const aba2t = compiled.querySelector('[data-testid="aba-2t"]') as HTMLButtonElement | null;
    const abaComp = compiled.querySelector(
      '[data-testid="aba-comparativo"]',
    ) as HTMLButtonElement | null;

    expect(aba1t).toBeTruthy();
    expect(aba1t?.classList.contains('whitespace-nowrap')).toBe(true);
    expect(aba2t).toBeTruthy();
    expect(aba2t?.classList.contains('whitespace-nowrap')).toBe(true);
    expect(abaComp).toBeTruthy();
    expect(abaComp?.classList.contains('whitespace-nowrap')).toBe(true);

    // 1º Turno padrão
    expect(component.abaPresidencial()).toBe('1t');
    expect(compiled.querySelector('[data-testid="painel-presidencial-1t"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="card-presidencial-1t-lula"]')).toBeTruthy();

    // Alternar para 2º Turno
    aba2t?.click();
    fixture.detectChanges();
    expect(component.abaPresidencial()).toBe('2t');
    expect(compiled.querySelector('[data-testid="painel-presidencial-2t"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="card-presidencial-2t-flavio"]')).toBeTruthy();

    // Alternar para Comparativo
    abaComp?.click();
    fixture.detectChanges();
    expect(component.abaPresidencial()).toBe('comparativo');
    expect(compiled.querySelector('[data-testid="painel-presidencial-comparativo"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="tabela-comparativa-presidencial"]')).toBeTruthy();
  });

  it('should correctly calculate and format comparative presidential data according to official TSE BU results', () => {
    const comp = component.comparativoPresidencial();
    expect(comp).toBeTruthy();
    // 312867 - 289672 = 23195
    expect(comp?.difFlavioVotos).toBe(23195);
    expect(component.formatarVariacaoVotos(comp?.difFlavioVotos)).toBe('+23.195');
    // 199121 - 159856 = 39265
    expect(comp?.difLulaVotos).toBe(39265);
    expect(component.formatarVariacaoVotos(comp?.difLulaVotos)).toBe('+39.265');
    // 38.89 - 32.38 = 6.51
    expect(comp?.difLulaPct).toBeCloseTo(6.51, 2);
    expect(component.formatarVariacaoPct(comp?.difLulaPct)).toContain('+6,51');
    // 61.11 - 58.67 = 2.44
    expect(comp?.difFlavioPct).toBeCloseTo(2.44, 2);
    expect(component.formatarVariacaoPct(comp?.difFlavioPct)).toContain('+2,44');
    // Comparecimento percentual: 82.31 - 79.98 = +2.33 p.p. (crescimento no 2T, refutando hipótese de queda)
    expect(comp?.difComparecimento).toBeCloseTo(2.33, 2);
    expect(comp?.difComparecimento).toBeGreaterThan(0);
    expect(component.formatarVariacaoPct(comp?.difComparecimento)).toContain('+2,33');
    // Comparecimento absoluto: 527124 - 512243 = +14881 eleitores (+14.887 no texto do DSH foi lapso aritmético sobre 527.124 e 512.243)
    expect(comp?.difComparecimentoAbs).toBe(14881);
    expect(comp?.difComparecimentoAbs).toBeGreaterThan(0);
    expect(component.formatarVariacaoVotos(comp?.difComparecimentoAbs)).toBe('+14.881');

    // Validação de consistência matemática
    const aptos = comp?.t1.eleitores_aptos ?? 0;
    const calcPct1 = ((comp?.t1.comparecimento_abs ?? 0) / aptos) * 100;
    const calcPct2 = ((comp?.t2.comparecimento_abs ?? 0) / aptos) * 100;
    expect(comp?.t1.comparecimento_pct).toBeCloseTo(calcPct1, 1);
    expect(comp?.t2.comparecimento_pct).toBeCloseTo(calcPct2, 1);
  });

  it('should render appropriate badge classes dynamically based on section status (oficial, curado, pendente)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.badge-oficial').length).toBeGreaterThan(0);

    const customSnapshot = JSON.parse(JSON.stringify(mockSnapshot)) as MunicipioSnapshot;
    if (customSnapshot.secoes.resumo_economia) {
      customSnapshot.secoes.resumo_economia.status = 'curado';
    }
    if (customSnapshot.secoes.governador) {
      customSnapshot.secoes.governador.status = 'pendente';
    }
    currentSnapshot = customSnapshot;
    component.tentarNovamente();
    fixture.detectChanges();

    const badgeCurado = compiled.querySelector(
      '[data-testid="card-resumo-economia"] .badge-curado',
    );
    expect(badgeCurado).toBeTruthy();
    expect(badgeCurado?.textContent).toContain('curado');

    const badgePendente = compiled.querySelector('[data-testid="card-governador"] .badge-pendente');
    expect(badgePendente).toBeTruthy();
    expect(badgePendente?.textContent).toContain('pendente');
  });

  it('should render economic and governor sections according to official TSE data (US-10)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="card-resumo-economia"]')).toBeTruthy();

    const cardGov = compiled.querySelector('[data-testid="card-governador"]');
    expect(cardGov).toBeTruthy();
    expect(cardGov?.textContent).toContain('EDUARDO RIEDEL');
    expect(cardGov?.textContent).toContain('PP');
    expect(cardGov?.textContent).toContain('914.323');
    expect(cardGov?.textContent).toContain('67,07%');
    expect(cardGov?.textContent).toContain('31/12/2030');
    expect(cardGov?.textContent).toContain('SIM');
    expect(cardGov?.textContent).toContain('reeleito');
    expect(cardGov?.textContent).toContain('ELEITO');
    expect(cardGov?.textContent).toContain('Situação TSE');
    expect(cardGov?.textContent).toContain('Mandato: 2027-2030');
    expect(cardGov?.textContent).toContain('% Nominais do cargo');
    expect(cardGov?.textContent).toContain(
      'Reeleito em 2026. Exercício do mandato atual 2023-2026 (TSE 2022); novo mandato 2027-2030 (TSE 2026).',
    );
    expect(
      cardGov?.querySelector('[data-testid="governador-link-fonte"]')?.getAttribute('href'),
    ).toContain('dadosabertos.tse.jus.br');
  });

  it('should render governor section with concise badge and unambiguous TSE header (P2-11, P2-12)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cardGov = compiled.querySelector('[data-testid="card-governador"]') as HTMLElement;
    expect(cardGov).toBeTruthy();
    const badgeMandato = cardGov.querySelector('[data-testid="governador-badge-mandato"]');
    expect(badgeMandato?.textContent?.trim()).toBe('Mandato: 2027-2030');
    expect(
      cardGov.querySelector('[data-testid="tabela-governador"] th:last-child')?.textContent?.trim(),
    ).toBe('Situação TSE');
  });

  it('should order deputados with em_exercicio=true first', () => {
    const ordenados = component.deputadosFederais();
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

  it('should display error alert when snapshot fails to load', () => {
    component.erroCarregamento.set('Erro ao carregar dados oficiais');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="alerta-erro-carregamento"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="botao-tentar-novamente"]')).toBeTruthy();
  });

  it('should contain clear and human-comprehensible data-testid attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="container-hero-cidade"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="titulo-cidade"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="select-cidade"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="card-cabecalho-cidade"]')).toBeTruthy();
    // card-cabecalho-cidade e container-hero-cidade unificados num só container
    expect(
      compiled.querySelector(
        '[data-testid="container-hero-cidade"] [data-testid="card-cabecalho-cidade"]',
      ),
    ).toBeTruthy();
    expect(compiled.querySelector('[data-testid="card-mapa-oficial"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="card-resumo-ibge"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="card-resumo-economia"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="card-deputados-federais"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="card-como-calculamos"]')).toBeTruthy();
  });
});
