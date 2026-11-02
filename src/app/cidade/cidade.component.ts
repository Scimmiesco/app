import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DataService } from '../core/services/data.service';
import { FonteMeta, ParlamentarItem } from '../core/models/contrato.model';
import { PartidoBadgeComponent } from '../shared/components/partido-badge/partido-badge.component';

export const CORES_PARTIDOS: Record<string, string> = {
  PT: '#a0001c',
  PDT: '#9e0b13',
  PCdoB: '#8b0000',
  PSOL: '#a50021',
  CIDADANIA: '#b00010',
  PL: '#003da5',
  UNIÃO: '#003b7a',
  UNIAO: '#003b7a',
  PP: '#00508f',
  PSDB: '#004a85',
  PSD: '#004e8c',
  REPUBLICANOS: '#0a2e6e',
  PODE: '#005580',
  DC: '#004b87',
  MDB: '#005a34',
  PV: '#005a34',
  REDE: '#00574b',
  NOVO: '#e05a00',
  AVANTE: '#1e3a8a',
  SOLIDARIEDADE: '#b94700',
  PSB: '#b45309',
  PROS: '#c2410c',
};

export const NUMEROS_CANDIDATOS_FALLBACK: Record<string, string> = {
  // Governador
  'EDUARDO RIEDEL': '11',
  'CAPITÃO CONTAR': '220',

  // Senadores
  'NELSINHO TRAD': '555',
  'SORAYA THRONICKE': '400',
  'TEREZA CRISTINA': '111',
  'REINALDO AZAMBUJA': '222',

  // Deputados Federais
  'CAMILA JARA': '1313',
  'MARCOS POLLON': '2222',
  'RODOLFO NOGUEIRA': '2200',
  'BETO PEREIRA': '1010',
  'DAGOBERTO NOGUEIRA': '1111',
  'DR. LUIZ OVANDO': '1122',
  'GERALDO RESENDE': '4455',
  'VANDER LOUBET': '1310',
  'ROSE MODESTO': '4444',
  'MARA CASEIRO': '2233',
  'ISA MARCONDES': '1022',

  // Deputados Estaduais
  'ZÉ TEIXEIRA': '22123',
  'PAULO CORRÊA': '22222',
  CARAVINA: '45123',
  'ZECA DO PT': '13613',
  'CORONEL DAVID': '22000',
  'ANDRÉ PUCCINELLI': '15151',
  'TIAGO BOTELHO': '13123',
  'ÂNGELO GUERREIRO': '45000',
  'GIANNI NOGUEIRA': '22111',
  'ODILON RIBEIRO': '22333',
  'GERSON CLARO': '11234',
  'LONDRES MACHADO': '11111',
  'HELIO PELUFFO': '45678',
  'DAVERSON MATOS': '44123',
  'PEDRO CARAVINA': '45145',
  'LUCAS DE LIMA': '12333',
  'JUNIOR MOCHI': '15000',
  'LIA NADER': '44000',
  'ROBERTO HASHIOKA': '44789',
  'PROFESSOR RINALDO': '20123',
  'MARCIO FERNANDES': '15555',
  'NENO RAZUK': '22777',
  'JOÃO HENRIQUE CATAN': '22456',
  'PEDRO KEMP': '13333',

  // Vereadores
  'MARQUINHOS TRAD': '12345',
  'RAFAEL TAVARES': '22000',
  'CARLÃO COMUNITÁRIO MESMO': '40123',
  'SILVIO PITU': '45123',
  'VETERINÁRIO FRANCISCO': '44123',
  'FABIO ROCHA': '44000',
  'PROFESSOR RIVERTON': '11123',
  'JUNIOR CORINGA': '15123',
  'DR VICTOR ROCHA': '45000',
  'PROFESSOR JUARI': '45555',
  'FLAVIO CABO ALMI': '45678',
  'LUIZA RIBEIRO': '13000',
  'ANDRÉ SALINEIRO AGENTE FEDERAL': '22123',
  PAPY: '45789',
  'ANA PORTELA': '22345',
  'NETO SANTOS': '10123',
  'MAICON NOGUEIRA': '11456',
  'DELEI PINHEIRO': '11789',
  'WILSON LANDS': '70123',
  'HERCULANO BORGES': '10000',
  'BETO AVELAR': '11000',
  'DR JAMAL': '15789',
  LANDMARK: '13123',
  'CLODOILSON PIRES': '20123',
  'JEAN FERREIRA': '13456',
  'DR LÍVIO': '44222',
  'RONILÇO GUERREIRO': '20000',
  LEINHA: '70000',
  'OTÁVIO TRAD': '55123',
};

@Component({
  selector: 'app-cidade',
  imports: [CommonModule, PartidoBadgeComponent],
  templateUrl: './cidade.component.html',
  styleUrl: './cidade.component.css',
})
export class CidadeComponent {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  readonly codigoIbge = input<string>('5002704');
  private readonly reloadTrigger = signal<number>(0);

  readonly carregando = signal<boolean>(true);
  readonly erroCarregamento = signal<string | null>(null);
  readonly mostrarMapa = signal<boolean>(false);
  readonly abaPresidencial = signal<'1t' | '2t' | 'comparativo'>('1t');

  private readonly params$ = combineLatest([
    toObservable(this.codigoIbge),
    toObservable(this.reloadTrigger),
  ]);

  readonly snapshot = toSignal(
    this.params$.pipe(
      tap(() => {
        this.carregando.set(true);
        this.erroCarregamento.set(null);
      }),
      switchMap(([codigo]) =>
        this.dataService.getCidade(codigo || '5002704').pipe(
          tap(() => {
            this.carregando.set(false);
          }),
          catchError((err) => {
            console.error('Erro ao carregar dados do município:', err);
            this.carregando.set(false);
            this.erroCarregamento.set(
              'Não foi possível carregar os dados oficiais deste município. Verifique se o arquivo está disponível ou tente novamente.',
            );
            return of(null);
          }),
        ),
      ),
    ),
    { initialValue: null },
  );

  readonly indice = toSignal(this.dataService.getIndiceCidades().pipe(catchError(() => of(null))), {
    initialValue: null,
  });

  readonly cidades = computed(() => {
    return (
      this.indice()?.cidades ?? [
        {
          codigo_ibge: 5002704,
          codigo_tse: '90514',
          nome: 'Campo Grande',
          uf: 'MS',
          arquivo: 'municipios/5002704.json',
          disponivel: true,
        },
      ]
    );
  });

  // Métodos de ordenação de listas parlamentares (em exercício primeiro, depois por votos)
  private ordenarParlamentares(itens?: ParlamentarItem[]): ParlamentarItem[] {
    if (!itens || !Array.isArray(itens)) return [];
    return [...itens].sort((a, b) => {
      if (a.em_exercicio && !b.em_exercicio) return -1;
      if (!a.em_exercicio && b.em_exercicio) return 1;
      return (b.votos ?? 0) - (a.votos ?? 0);
    });
  }

  readonly deputadosFederais = computed(() =>
    this.ordenarParlamentares(this.snapshot()?.secoes?.deputados_federais?.dados),
  );

  readonly senadores = computed(() =>
    this.ordenarParlamentares(this.snapshot()?.secoes?.senadores?.dados),
  );

  readonly governador = computed(() =>
    this.ordenarParlamentares(this.snapshot()?.secoes?.governador?.dados),
  );

  readonly deputadosEstaduais = computed(() =>
    this.ordenarParlamentares(this.snapshot()?.secoes?.deputados_estaduais?.dados),
  );

  readonly prefeito = computed(() =>
    this.ordenarParlamentares(this.snapshot()?.secoes?.prefeito?.dados),
  );

  readonly vereadores = computed(() =>
    this.ordenarParlamentares(this.snapshot()?.secoes?.vereadores?.dados),
  );

  getFonte(chaveFonte?: string): FonteMeta | undefined {
    if (!chaveFonte) return undefined;
    return this.snapshot()?.fontes?.[chaveFonte];
  }

  tentarNovamente(): void {
    const cod = this.codigoIbge() || '5002704';
    this.dataService.limparCacheCidade(cod);
    this.reloadTrigger.update((n) => n + 1);
  }

  toggleMapa(): void {
    this.mostrarMapa.update((aberto) => !aberto);
  }

  onCidadeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const novoCodigo = selectElement.value;
    if (novoCodigo) {
      this.router.navigate(['/cidade', novoCodigo]);
    }
  }

  formatarNumero(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    return new Intl.NumberFormat('pt-BR').format(val);
  }

  formatarMoeda(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  }

  formatarPct(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    return (
      new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val) + '%'
    );
  }

  readonly comparativoPresidencial = computed(() => {
    const t1 = this.snapshot()?.secoes?.eleicao_2026_1t?.dados;
    const t2 = this.snapshot()?.secoes?.eleicao_2026_2t?.dados;
    if (!t1 || !t2) return null;

    const outros1t = t1.outros ?? 0;
    const outros2t = t2.outros ?? 0;
    const pctOutros1t = Math.max(0, 100 - (t1.pct_lula + t1.pct_flavio));
    const pctOutros2t = Math.max(0, 100 - (t2.pct_lula + t2.pct_flavio));

    const compAbs1 =
      t1.comparecimento_abs ?? Math.round((t1.comparecimento_pct / 100) * t1.eleitores_aptos);
    const compAbs2 =
      t2.comparecimento_abs ?? Math.round((t2.comparecimento_pct / 100) * t2.eleitores_aptos);

    return {
      t1,
      t2,
      compAbs1,
      compAbs2,
      difLulaVotos: t2.lula - t1.lula,
      difLulaPct: t2.pct_lula - t1.pct_lula,
      difFlavioVotos: t2.flavio - t1.flavio,
      difFlavioPct: t2.pct_flavio - t1.pct_flavio,
      difOutrosVotos: outros2t - outros1t,
      difOutrosPct: pctOutros2t - pctOutros1t,
      difValidos: t2.validos - t1.validos,
      difComparecimento: t2.comparecimento_pct - t1.comparecimento_pct,
      difComparecimentoAbs: compAbs2 - compAbs1,
    };
  });

  selecionarAbaPresidencial(aba: '1t' | '2t' | 'comparativo'): void {
    this.abaPresidencial.set(aba);
  }

  formatarVariacaoVotos(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    const sinal = val > 0 ? '+' : '';
    return `${sinal}${this.formatarNumero(val)}`;
  }

  formatarVariacaoPct(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    const sinal = val > 0 ? '+' : '';
    return (
      sinal +
      new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val) +
      ' p.p.'
    );
  }

  formatarDataIso(isoStr?: string | null): string {
    if (!isoStr) return '—';
    try {
      const partes = isoStr.split('-');
      if (partes.length === 3) {
        const ano = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const dia = parseInt(partes[2], 10);
        const data = new Date(ano, mes, dia);
        return new Intl.DateTimeFormat('pt-BR').format(data);
      }
    } catch {
      // fallback
    }
    return isoStr;
  }

  getNumero(cand?: ParlamentarItem | null): string | null {
    if (!cand) return null;
    if (cand.numero !== undefined && cand.numero !== null && String(cand.numero).trim() !== '') {
      return String(cand.numero).trim();
    }
    const nomeNorm = (cand.nome_urna || cand.nome || '').toUpperCase().trim();
    return NUMEROS_CANDIDATOS_FALLBACK[nomeNorm] || null;
  }

  getNumeroPrefixo(numero?: string | number | null): string {
    if (!numero) return '';
    const str = String(numero).trim();
    return str.slice(0, 2);
  }

  getNumeroResto(numero?: string | number | null): string {
    if (!numero) return '';
    const str = String(numero).trim();
    return str.slice(2);
  }

  getCorPartido(sigla?: string | null): string {
    if (!sigla) return '#000000';
    const s = sigla.trim().toUpperCase();
    return CORES_PARTIDOS[s] || '#000000';
  }
}
