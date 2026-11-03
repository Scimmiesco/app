import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CidadeComponent } from './cidade.component';
import { DataService } from '../core/services/data.service';
import { IndiceCidades, MunicipioSnapshot, ParlamentarItem } from '../core/models/contrato.model';

describe('CidadeComponent', () => {
  let component: CidadeComponent;
  let fixture: ComponentFixture<CidadeComponent>;

  const mockSnapshot: MunicipioSnapshot = {
    schema_version: '0.8.0',
    gerado_em: '2026-11-01T22:41:18-0400',
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
      tse_2024_abertos: {
        orgao: 'TSE',
        titulo: 'Arquivos abertos 2024',
        url: 'https://dadosabertos.tse.jus.br/dataset/resultados-2024',
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
      inep_ideb_2023: {
        orgao: 'INEP',
        titulo: 'IDEB 2023',
        url: 'https://www.gov.br/inep/',
        consultado_em: '2026-10-26',
        confianca: 'oficial',
      },
      siconfi_dca_2023: {
        orgao: 'SICONFI',
        titulo: 'DCA 2023',
        url: 'https://siconfi.tesouro.gov.br/',
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
      senado_api: {
        orgao: 'Senado Federal',
        titulo: 'Dados Abertos Senado',
        url: 'https://legis.senado.leg.br/',
        consultado_em: '2026-10-29',
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
        titulo: 'Panorama geral',
        categoria: 'A CIDADE',
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
        },
      },
      resumo_economia: {
        titulo: 'Economia',
        categoria: 'A CIDADE',
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
      resumo_educacao: {
        titulo: 'Educação',
        categoria: 'A CIDADE',
        status: 'oficial',
        fonte: 'inep_ideb_2023',
        ano: 2023,
        coletado_em: '2026-10-26',
        motivo: null,
        dados: {
          anos_iniciais: { '2023': 5.8 },
          anos_finais: { '2023': 5.1 },
        },
      },
      resumo_financas: {
        titulo: 'Finanças municipais',
        categoria: 'A CIDADE',
        status: 'oficial',
        fonte: 'siconfi_dca_2023',
        ano: 2023,
        coletado_em: '2026-10-26',
        motivo: null,
        dados: {
          receita_total: 4200000000,
          transferencias_correntes: 1500000000,
          iptu: 680000000,
          iss: 720000000,
          pct_transferencias_sobre_correntes: 35.7,
        },
      },
      eleicao_2026_1t: {
        titulo: 'Presidencial — 1º turno',
        categoria: 'ELEIÇÃO 2026',
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
        titulo: 'Presidencial — 2º turno',
        categoria: 'ELEIÇÃO 2026',
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
        titulo: 'Deputados federais de MS',
        categoria: 'ELEIÇÃO 2026',
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
            numero: '4444',
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
            numero: '1367',
            votos: 154157,
            pct: 11.27,
            situacao: 'ELEITO POR QP',
            em_exercicio: true,
            mandato_fim: '2031-01-31',
            status_eleicao_2026: 'reeleito',
            votos_nominais_mandato_atual: 958,
          },
          {
            nome: 'Vander Loubet',
            nome_urna: 'Vander Loubet',
            partido: 'PT',
            numero: null,
            numero_historico: {
              numero: '1331',
              ano: 2022,
              cargo: 'DEPUTADO FEDERAL',
              fonte: 'tse_candidatos_2022',
            },
            votos: null,
            pct: null,
            situacao: null,
            em_exercicio: true,
            mandato_inicio: '2023-02-01',
            mandato_fim: '2027-01-31',
            status_eleicao_2026: 'nao_reeleito',
            votos_nominais_mandato_atual: 930,
          },
        ],
      },
      governador: {
        titulo: 'Governador de MS',
        categoria: 'ELEIÇÃO 2026',
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
            numero: '11',
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
      senadores: {
        titulo: 'Senadores de MS',
        categoria: 'ELEIÇÃO 2026',
        status: 'oficial',
        fonte: 'senado_api',
        ano: 2026,
        coletado_em: '2026-10-29',
        motivo: null,
        pct_base: 'votos_nominais_do_cargo',
        dados: [
          {
            nome: 'TEREZA CRISTINA',
            nome_urna: 'TEREZA CRISTINA',
            partido: 'PP',
            numero: null,
            numero_historico: {
              numero: '111',
              ano: 2022,
              cargo: 'SENADOR',
              fonte: 'tse_candidatos_2022',
            },
            votos: null,
            pct: null,
            situacao: 'EM EXERCÍCIO',
            em_exercicio: true,
            mandato_inicio: '2023-02-01',
            mandato_fim: '2031-01-31',
            status_eleicao_2026: 'em_exercicio',
          },
          {
            nome: 'SORAYA THRONICKE',
            nome_urna: 'SORAYA THRONICKE',
            partido: 'PSB',
            numero: '400',
            numero_historico: null,
            votos: null,
            pct: null,
            situacao: 'EM EXERCÍCIO',
            em_exercicio: true,
            mandato_inicio: '2019-02-01',
            mandato_fim: '2027-01-31',
            status_eleicao_2026: 'em_exercicio',
          },
        ],
      },
      deputados_estaduais: {
        titulo: 'Deputados estaduais de MS',
        categoria: 'ELEIÇÃO 2026',
        status: 'oficial',
        fonte: 'tse_2026_abertos',
        ano: 2026,
        coletado_em: '2026-10-29',
        motivo: null,
        dados: [
          {
            nome: 'CORONEL DAVID',
            nome_urna: 'CORONEL DAVID',
            partido: 'PL',
            votos: 31480,
            pct: 2.18,
            situacao: 'ELEITO',
            em_exercicio: false,
            mandato_fim: '2031-01-31',
            status_eleicao_2026: 'eleito',
          },
        ],
      },
      prefeito: {
        titulo: 'Prefeito de Campo Grande',
        categoria: 'MANDATO LOCAL',
        status: 'oficial',
        fonte: 'tse_2024_abertos',
        ano: 2024,
        coletado_em: '2026-10-29',
        motivo: null,
        dados: [
          {
            nome: 'ADRIANE LOPES',
            nome_urna: 'ADRIANE LOPES',
            partido: 'PP',
            numero: '11',
            votos: 222407,
            pct: 51.45,
            situacao: 'ELEITO',
            em_exercicio: true,
            mandato_fim: '2028-12-31',
            status_eleicao_2026: 'em_exercicio',
          },
        ],
      },
      vereadores: {
        titulo: 'Vereadores de Campo Grande',
        categoria: 'MANDATO LOCAL',
        status: 'oficial',
        fonte: 'tse_2024_abertos',
        ano: 2024,
        coletado_em: '2026-10-29',
        motivo: null,
        dados: [
          {
            nome: 'MARQUINHOS TRAD',
            nome_urna: 'MARQUINHOS TRAD',
            partido: 'PDT',
            votos: 8567,
            pct: 1.95,
            situacao: 'ELEITO',
            em_exercicio: true,
            mandato_fim: '2028-12-31',
            status_eleicao_2026: 'em_exercicio',
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

  it('should apply party colors, badges, numbers, and progress bars to presidential candidates in 1T, 2T, and comparativo', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // 1º Turno
    component.selecionarAbaPresidencial('1t');
    fixture.detectChanges();

    const cardFlavio1t = compiled.querySelector('[data-testid="card-presidencial-1t-flavio"]');
    expect(cardFlavio1t).toBeTruthy();
    expect(cardFlavio1t?.getAttribute('data-partido')).toBe('PL');
    expect(cardFlavio1t?.querySelector('app-partido-badge')?.textContent).toContain('PL');
    expect(cardFlavio1t?.querySelector('.digito-partido')?.textContent).toContain('22');
    expect(cardFlavio1t?.querySelector('.barra-votos-preenchimento')).toBeTruthy();

    const cardLula1t = compiled.querySelector('[data-testid="card-presidencial-1t-lula"]');
    expect(cardLula1t).toBeTruthy();
    expect(cardLula1t?.getAttribute('data-partido')).toBe('PT');
    expect(cardLula1t?.querySelector('app-partido-badge')?.textContent).toContain('PT');
    expect(cardLula1t?.querySelector('.digito-partido')?.textContent).toContain('13');
    expect(cardLula1t?.querySelector('.barra-votos-preenchimento')).toBeTruthy();

    // 2º Turno
    component.selecionarAbaPresidencial('2t');
    fixture.detectChanges();

    const cardFlavio2t = compiled.querySelector('[data-testid="card-presidencial-2t-flavio"]');
    expect(cardFlavio2t).toBeTruthy();
    expect(cardFlavio2t?.getAttribute('data-partido')).toBe('PL');
    expect(cardFlavio2t?.querySelector('app-partido-badge')?.textContent).toContain('PL');
    expect(cardFlavio2t?.querySelector('.digito-partido')?.textContent).toContain('22');

    const cardLula2t = compiled.querySelector('[data-testid="card-presidencial-2t-lula"]');
    expect(cardLula2t).toBeTruthy();
    expect(cardLula2t?.getAttribute('data-partido')).toBe('PT');
    expect(cardLula2t?.querySelector('app-partido-badge')?.textContent).toContain('PT');
    expect(cardLula2t?.querySelector('.digito-partido')?.textContent).toContain('13');

    // Comparativo
    component.selecionarAbaPresidencial('comparativo');
    fixture.detectChanges();

    const cardFlavioComp = compiled.querySelector('[data-testid="card-comp-flavio"]');
    expect(cardFlavioComp).toBeTruthy();
    expect(cardFlavioComp?.getAttribute('data-partido')).toBe('PL');

    const cardLulaComp = compiled.querySelector('[data-testid="card-comp-lula"]');
    expect(cardLulaComp).toBeTruthy();
    expect(cardLulaComp?.getAttribute('data-partido')).toBe('PT');

    const tabelaComp = compiled.querySelector('[data-testid="tabela-comparativa-presidencial"]');
    expect(tabelaComp).toBeTruthy();
    const rows = tabelaComp?.querySelectorAll('tbody tr.tr-candidato');
    expect(rows?.length).toBe(3);
    expect(rows?.[0].getAttribute('data-partido')).toBe('PL');
    expect(rows?.[1].getAttribute('data-partido')).toBe('PT');
    expect(rows?.[2].getAttribute('data-partido')).toBe('OUTROS');
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
    expect(cardGov?.querySelector('app-partido-badge [data-partido="PP"]')).toBeTruthy();
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
    expect(ordenados.length).toBe(3);
    expect(ordenados[0].em_exercicio).toBe(true);
    expect(ordenados[1].em_exercicio).toBe(true);
    expect(ordenados[2].nome_urna).toBe('ROSE MODESTO');
    expect(ordenados[2].em_exercicio).toBe(false);
  });

  it('should render federal deputies table with mandate end and votes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('CAMILA JARA');
    expect(compiled.textContent).toContain('31/01/2031');
    expect(compiled.textContent).toContain('958');
  });

  it('should apply em-exercicio class to deputados with em_exercicio=true and not to false', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linhaCamila = compiled.querySelector('[data-testid="linha-deputado-camila jara"]');
    const linhaRose = compiled.querySelector('[data-testid="linha-deputado-rose modesto"]');

    expect(linhaCamila).toBeTruthy();
    expect(linhaCamila?.classList.contains('em-exercicio')).toBe(true);

    expect(linhaRose).toBeTruthy();
    expect(linhaRose?.classList.contains('em-exercicio')).toBe(false);
  });

  it('should render candidate number below name with first 2 digits in party color and rest in black', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linhaCamila = compiled.querySelector('[data-testid="linha-deputado-camila jara"]');
    const numEl = linhaCamila?.querySelector('[data-testid="numero-candidato"]');

    expect(numEl).toBeTruthy();
    expect(numEl?.classList.contains('text-sm')).toBe(true);

    const digitoPartido = numEl?.querySelector('.digito-partido');
    const digitoResto = numEl?.querySelector('.digito-resto');

    expect(digitoPartido?.textContent?.trim()).toBe('13');
    // PT color is #a0001c (rgb(160, 0, 28))
    expect((digitoPartido as HTMLElement)?.style.color).toBe('rgb(160, 0, 28)');

    expect(digitoResto?.textContent?.trim()).toBe('67');
    expect(digitoResto?.classList.contains('text-black')).toBe(true);
  });

  it('should render historical candidate number with year for senators without 2026 candidacy (US-14)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linhaTereza = compiled.querySelector('[data-testid="linha-senador-tereza cristina"]');
    expect(linhaTereza).toBeTruthy();

    const numEl = linhaTereza?.querySelector('[data-testid="numero-candidato"]');
    expect(numEl).toBeTruthy();
    expect(numEl?.textContent).toContain('Último:');
    expect(numEl?.textContent).toContain('111');
    expect(numEl?.textContent).toContain('2022');

    const digitoPartido = numEl?.querySelector('.digito-partido');
    const digitoResto = numEl?.querySelector('.digito-resto');

    expect(digitoPartido?.textContent?.trim()).toBe('11');
    // PP color is #00508f (rgb(0, 80, 143))
    expect((digitoPartido as HTMLElement)?.style.color).toBe('rgb(0, 80, 143)');
    expect(digitoResto?.textContent?.trim()).toBe('1');
    expect(digitoResto?.classList.contains('text-black')).toBe(true);

    // Vander Loubet (deputado federal sem eleição 2026)
    const linhaVander = compiled.querySelector('[data-testid="linha-deputado-vander loubet"]');
    expect(linhaVander).toBeTruthy();

    const numElVander = linhaVander?.querySelector('[data-testid="numero-candidato"]');
    expect(numElVander).toBeTruthy();
    expect(numElVander?.textContent).toContain('Último:');
    expect(numElVander?.textContent).toContain('1331');
    expect(numElVander?.textContent).toContain('2022');

    const prefixoVander = numElVander?.querySelector('.digito-partido');
    const restoVander = numElVander?.querySelector('.digito-resto');

    expect(prefixoVander?.textContent?.trim()).toBe('13');
    // PT color is #a0001c (rgb(160, 0, 28))
    expect((prefixoVander as HTMLElement)?.style.color).toBe('rgb(160, 0, 28)');
    expect(restoVander?.textContent?.trim()).toBe('31');
    expect(restoVander?.classList.contains('text-black')).toBe(true);
  });

  it('should render current ballot number 400 for Soraya Thronicke without "Último" (P1-28)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linhaSoraya = compiled.querySelector('[data-testid="linha-senador-soraya thronicke"]');
    expect(linhaSoraya).toBeTruthy();

    const numEl = linhaSoraya?.querySelector('[data-testid="numero-candidato"]');
    expect(numEl).toBeTruthy();
    expect(numEl?.textContent).toContain('400');
    expect(numEl?.textContent).not.toContain('Último');
    expect(numEl?.classList.contains('numero-historico')).toBe(false);

    const digitoPartido = numEl?.querySelector('.digito-partido');
    const digitoResto = numEl?.querySelector('.digito-resto');

    expect(digitoPartido?.textContent?.trim()).toBe('40');
    // PSB color is #b45309 (rgb(180, 83, 9))
    expect((digitoPartido as HTMLElement)?.style.color).toBe('rgb(180, 83, 9)');
    expect(digitoResto?.textContent?.trim()).toBe('0');
    expect(digitoResto?.classList.contains('text-black')).toBe(true);
  });

  it('should return historical candidate number info via getNumeroHistorico (US-14)', () => {
    // Official cases from DSH / TSE (consulta_cand)
    const nelsinho = component.getNumeroHistorico({
      nome: 'Nelsinho Trad',
      numero: null,
      numero_historico: {
        numero: '144',
        ano: 2018,
        cargo: 'SENADOR',
        fonte: 'tse_candidatos_2018',
      },
    } as unknown as ParlamentarItem);
    expect(nelsinho).toEqual({
      numero: '144',
      ano: 2018,
      cargo: 'SENADOR',
      fonte: 'tse_candidatos_2018',
    });

    const tereza = component.getNumeroHistorico({
      nome: 'Tereza Cristina',
      numero: null,
      numero_historico: {
        numero: '111',
        ano: 2022,
        cargo: 'SENADOR',
        fonte: 'tse_candidatos_2022',
      },
    } as unknown as ParlamentarItem);
    expect(tereza).toEqual({
      numero: '111',
      ano: 2022,
      cargo: 'SENADOR',
      fonte: 'tse_candidatos_2022',
    });

    const vander = component.getNumeroHistorico({
      nome: 'Vander Loubet',
      numero: null,
      numero_historico: {
        numero: '1331',
        ano: 2022,
        cargo: 'DEPUTADO FEDERAL',
        fonte: 'tse_candidatos_2022',
      },
    } as unknown as ParlamentarItem);
    expect(vander).toEqual({
      numero: '1331',
      ano: 2022,
      cargo: 'DEPUTADO FEDERAL',
      fonte: 'tse_candidatos_2022',
    });

    // Soraya disputou 2026: possui número atual 400 e numero_historico nulo (P1-28)
    const soraya2026 = component.getNumeroHistorico({
      nome: 'Soraya Thronicke',
      numero: '400',
      numero_historico: null,
    } as unknown as ParlamentarItem);
    expect(soraya2026).toBeNull();

    // Candidate without historical number
    const semHistorico = component.getNumeroHistorico({
      nome: 'FULANO',
      numero: null,
      numero_historico: null,
    } as unknown as ParlamentarItem);
    expect(semHistorico).toBeNull();
  });

  it('should strictly return cand.numero without fallback dictionary (US-13)', () => {
    // Oficial numbers from TSE / DSH 0.7.0
    expect(
      component.getNumero({
        nome: 'LIDIO LOPES',
        nome_urna: 'LIDIO LOPES',
        partido: 'AVANTE',
        numero: '70777',
      } as unknown as ParlamentarItem),
    ).toBe('70777');
    expect(
      component.getNumero({
        nome: 'CAMILA JARA',
        nome_urna: 'CAMILA JARA',
        partido: 'PT',
        numero: '1367',
      } as unknown as ParlamentarItem),
    ).toBe('1367');
    expect(
      component.getNumero({
        nome: 'CAPITÃO CONTAR',
        nome_urna: 'CAPITÃO CONTAR',
        partido: 'PRTB',
        numero: '221',
      } as unknown as ParlamentarItem),
    ).toBe('221');
    expect(
      component.getNumero({
        nome: 'MARA CASEIRO',
        nome_urna: 'MARA CASEIRO',
        partido: 'PSDB',
        numero: '2200',
      } as unknown as ParlamentarItem),
    ).toBe('2200');
    expect(
      component.getNumero({
        nome: 'ADRIANE LOPES',
        nome_urna: 'ADRIANE LOPES',
        partido: 'PP',
        numero: '11',
      } as unknown as ParlamentarItem),
    ).toBe('11');

    // Candidata ao Senado 2026 com número oficial (P1-28)
    expect(
      component.getNumero({
        nome: 'SORAYA THRONICKE',
        nome_urna: 'SORAYA',
        partido: 'PSB',
        numero: '400',
      } as unknown as ParlamentarItem),
    ).toBe('400');

    // Senadores sem candidatura 2026 (numero null)
    expect(
      component.getNumero({
        nome: 'TEREZA CRISTINA',
        nome_urna: 'TEREZA CRISTINA',
        partido: 'PP',
        numero: null,
      } as unknown as ParlamentarItem),
    ).toBeNull();
    expect(
      component.getNumero({
        nome: 'NELSINHO TRAD',
        nome_urna: 'NELSINHO TRAD',
        partido: 'PSD',
        numero: null,
      } as unknown as ParlamentarItem),
    ).toBeNull();

    // No fallback to party prefix if numero is missing/null
    expect(
      component.getNumero({
        nome: 'FULANO SEM NUMERO',
        nome_urna: 'FULANO',
        partido: 'PT',
        numero: null,
      } as unknown as ParlamentarItem),
    ).toBeNull();
  });

  it('should format status values removing raw underscores (P2-06)', () => {
    expect(component.formatarStatus('em_exercicio')).toBe('em exercício');
    expect(component.formatarStatus('nao_reeleito')).toBe('não reeleito');
    expect(component.formatarStatus('reeleito')).toBe('reeleito');
    expect(component.formatarStatus('eleito')).toBe('eleito');
    expect(component.formatarStatus(null)).toBe('—');
  });

  it('should display error alert when snapshot fails to load', () => {
    component.erroCarregamento.set('Erro ao carregar dados oficiais');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="alerta-erro-carregamento"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="botao-tentar-novamente"]')).toBeTruthy();
  });

  it('should implement title and kicker system with single H1 according to US-12 and ADR-016', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Um único H1 na página
    const h1s = compiled.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent).toContain('Campo Grande / MS');

    // Subtítulo descritivo no hero (sem linha técnica de snapshot)
    const subtitulo = compiled.querySelector('[data-testid="subtitulo-cidade"]');
    expect(subtitulo?.textContent?.trim()).toBe('Panorama da cidade e de quem foi eleito');

    // Linha técnica de snapshot movida para o rodapé
    const metaSnapshot = compiled.querySelector('[data-testid="texto-meta-snapshot"]');
    expect(metaSnapshot).toBeTruthy();
    expect(metaSnapshot?.textContent).toContain('schema 0.8.0');

    // Kickers e Títulos H2 em todas as 13 seções + metodologia
    const checarBloco = (
      kickerTestId: string,
      tituloTestId: string,
      kickerEsperado: string,
      tituloEsperado: string,
    ) => {
      const kicker = compiled.querySelector(`[data-testid="${kickerTestId}"]`);
      const titulo = compiled.querySelector(`[data-testid="${tituloTestId}"]`);
      expect(kicker, `Kicker ${kickerTestId} deve existir`).toBeTruthy();
      expect(kicker?.textContent?.trim()).toBe(kickerEsperado);
      expect(titulo, `Título ${tituloTestId} deve existir`).toBeTruthy();
      expect(titulo?.textContent?.trim()).toBe(tituloEsperado);
      expect(titulo?.tagName.toLowerCase()).toBe('h2');
    };

    // A CIDADE
    checarBloco('cabecalho-kicker', 'cabecalho-titulo', 'A CIDADE', 'Panorama geral');
    checarBloco('resumo-ibge-kicker', 'resumo-ibge-titulo', 'A CIDADE', 'Demografia e renda');
    checarBloco('resumo-economia-kicker', 'resumo-economia-titulo', 'A CIDADE', 'Economia');
    checarBloco('resumo-educacao-kicker', 'resumo-educacao-titulo', 'A CIDADE', 'Educação');
    checarBloco(
      'resumo-financas-kicker',
      'resumo-financas-titulo',
      'A CIDADE',
      'Finanças municipais',
    );

    // TERRITÓRIO
    checarBloco('mapa-kicker', 'mapa-titulo', 'TERRITÓRIO', 'Mapa do município');

    // ELEIÇÃO 2026
    checarBloco(
      'eleicao-presidencial-kicker',
      'titulo-eleicao-presidencial',
      'ELEIÇÃO 2026',
      'Presidencial — 1º e 2º turnos',
    );
    checarBloco('governador-kicker', 'governador-titulo', 'ELEIÇÃO 2026', 'Governador de MS');
    checarBloco('senadores-kicker', 'senadores-titulo', 'ELEIÇÃO 2026', 'Senadores de MS');
    checarBloco(
      'deputados-federais-kicker',
      'deputados-titulo',
      'ELEIÇÃO 2026',
      'Deputados federais de MS',
    );
    checarBloco(
      'deputados-estaduais-kicker',
      'deputados-estaduais-titulo',
      'ELEIÇÃO 2026',
      'Deputados estaduais de MS',
    );

    // MANDATO LOCAL
    checarBloco('prefeito-kicker', 'prefeito-titulo', 'MANDATO LOCAL', 'Prefeito de Campo Grande');
    checarBloco(
      'vereadores-kicker',
      'vereadores-titulo',
      'MANDATO LOCAL',
      'Vereadores de Campo Grande',
    );

    // METODOLOGIA
    checarBloco(
      'como-calculamos-kicker',
      'titulo-como-calculamos',
      'METODOLOGIA',
      'Como calculamos',
    );

    // Nenhum H2 carrega fonte ou ano embutido no título
    const todosH2 = Array.from(compiled.querySelectorAll('h2')).map((h) => h.textContent || '');
    for (const h2Text of todosH2) {
      expect(h2Text).not.toContain('(TSE)');
      expect(h2Text).not.toContain('(IBGE)');
      expect(h2Text).not.toContain('(INEP)');
      expect(h2Text).not.toContain('(SICONFI)');
      expect(h2Text).not.toMatch(/\(20\d\d\)/);
    }
  });

  it('should render standardized error kicker and title when snapshot loading fails (US-12)', () => {
    component.erroCarregamento.set('Serviço indisponível');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const kickerErro = compiled.querySelector('[data-testid="kicker-erro"]');
    const tituloErro = compiled.querySelector('[data-testid="titulo-erro"]');

    expect(kickerErro?.textContent?.trim()).toBe('ERRO');
    expect(tituloErro?.textContent?.trim()).toBe('Não foi possível carregar os dados');
    expect(tituloErro?.tagName.toLowerCase()).toBe('h2');
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

  it('should render candidate avatars across parlamentar tables and mayoral card (US-15)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const avatars = compiled.querySelectorAll('app-candidato-avatar');
    expect(avatars.length).toBeGreaterThan(0);

    // Governador
    const govCard = compiled.querySelector('[data-testid="card-governador"]');
    expect(govCard?.querySelector('app-candidato-avatar')).toBeTruthy();

    // Deputados Federais
    const depCard = compiled.querySelector('[data-testid="card-deputados-federais"]');
    expect(depCard?.querySelector('app-candidato-avatar')).toBeTruthy();

    // Prefeito
    const prefCard = compiled.querySelector('[data-testid="card-prefeito"]');
    expect(prefCard?.querySelector('app-candidato-avatar')).toBeTruthy();
  });

  it('should apply responsive column classes and ellipsis accessibility titles on candidate names', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Candidatos possuem classe nome-candidato e atributo title para acessibilidade em nomes truncados
    const nomes = compiled.querySelectorAll('.nome-candidato');
    expect(nomes.length).toBeGreaterThan(0);
    nomes.forEach((el) => {
      expect(el.getAttribute('title')).toBeTruthy();
    });

    // Colunas secundárias em tabelas usam hidden sm:table-cell para otimização em mobile 393px
    const govTable = compiled.querySelector('[data-testid="tabela-governador"]');
    expect(govTable).toBeTruthy();
    const thsGov = govTable?.querySelectorAll('th.hidden.sm\\:table-cell');
    expect(thsGov && thsGov.length).toBeGreaterThanOrEqual(2);
  });
});
