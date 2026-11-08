import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  EconomiaBenchmark,
  EducacaoItemBenchmark,
  FonteMeta,
  ResumoEconomiaDados,
  ResumoFinancasDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import {
  formatarDesvioPct,
  formatarMoeda,
  formatarMultiplicador,
  formatarNota,
  formatarNumero,
} from '../../../core/utils/formatadores';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';

export type ChaveBenchmarkEconomia =
  | 'pib_total'
  | 'pib_per_capita'
  | 'renda_media_pc'
  | 'renda_mediana_pc'
  | 'receita_bruta'
  | 'despesa_bruta';

const METRICAS_ABSOLUTAS: ReadonlySet<ChaveBenchmarkEconomia> = new Set([
  'pib_total',
  'receita_bruta',
  'despesa_bruta',
]);

const ROTULOS_METRICAS_ECONOMIA: Record<ChaveBenchmarkEconomia, string> = {
  pib_total: 'PIB Total',
  pib_per_capita: 'PIB Per Capita',
  renda_media_pc: 'Renda Média p/c',
  renda_mediana_pc: 'Renda Mediana p/c',
  receita_bruta: 'Receitas Brutas',
  despesa_bruta: 'Despesas Empenhadas',
};

export interface IndicadorNacionalEconomia {
  /** Desvio absoluto em R$ em relação à mediana nacional */
  desvio: number;
  /** Desvio percentual em relação à mediana nacional */
  desvioPct: number;
  /** Fator multiplicador em relação à mediana nacional (métricas brutas) */
  fatorMediana?: number;
  /** Posição no ranking nacional (1º = maior valor do Brasil) */
  posicao?: number;
  posicaoTotal?: number;
  quartil?: number;
  rotuloQuartil?: string;
  /** Valor formatado para exibição: "Xº no Brasil" (totais brutos/finanças) ou "+57,4%" (per capita) */
  valorFormatado: string;
  cor: 'verde' | 'vermelho' | 'preto';
  simbolo: string;
  rotulo: string;
  rotuloCurto: string;
  mediana?: number;
  n?: number;
  tooltip: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-resumo-economia',
  imports: [CabecalhoSecaoComponent],
  templateUrl: './resumo-economia.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoEconomiaComponent {
  readonly secao = input<SecaoEnvelope<ResumoEconomiaDados, EconomiaBenchmark> | null | undefined>(
    null,
  );
  readonly secaoFinancas = input<
    SecaoEnvelope<ResumoFinancasDados, EconomiaBenchmark> | null | undefined
  >(null);
  readonly rendaMedia = input<number | null | undefined>(null);
  readonly rendaMediana = input<number | null | undefined>(null);
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly fonteFinancas = input<FonteMeta | undefined>(undefined);

  protected readonly formatarMoeda = formatarMoeda;

  obterIndicador(chave: ChaveBenchmarkEconomia): IndicadorNacionalEconomia | null {
    const comp: EducacaoItemBenchmark | undefined =
      this.secao()?.benchmark?.comparacoes?.[chave] ??
      this.secaoFinancas()?.benchmark?.comparacoes?.[chave];

    if (!comp || comp.desvio_pct_mediana === undefined || comp.desvio_pct_mediana === null) {
      return null;
    }

    const ehAbsoluta =
      METRICAS_ABSOLUTAS.has(chave) &&
      comp.fator_mediana !== undefined &&
      comp.fator_mediana !== null;
    const temRanking =
      METRICAS_ABSOLUTAS.has(chave) && comp.posicao !== undefined && comp.posicao !== null;
    const desvioPct = comp.desvio_pct_mediana;
    const desvio = comp.desvio_mediana ?? 0;
    const fatorMediana = comp.fator_mediana;
    const posicao = comp.posicao;
    const posicaoTotal = comp.posicao_total ?? comp.n;
    const quartil = comp.quartil;

    let rotuloQuartil: string | undefined;
    if (quartil) {
      if (quartil === 4) {
        rotuloQuartil =
          comp.percentil >= 99
            ? '4º quartil nacional (Top 1% — maiores do Brasil)'
            : '4º quartil nacional (25% maiores do país)';
      } else if (quartil === 3) {
        rotuloQuartil = '3º quartil nacional (acima da mediana)';
      } else if (quartil === 2) {
        rotuloQuartil = '2º quartil nacional (abaixo da mediana)';
      } else {
        rotuloQuartil = '1º quartil nacional (25% menores do país)';
      }
    }

    let valorFormatado: string;
    if (temRanking && posicao) {
      valorFormatado = `${formatarNumero(posicao)}º no Brasil`;
    } else if (ehAbsoluta) {
      valorFormatado = formatarMultiplicador(fatorMediana);
    } else {
      valorFormatado = formatarDesvioPct(desvioPct);
    }

    let cor: 'verde' | 'vermelho' | 'preto';
    let simbolo: string;
    let rotuloCurto: string;

    const epsilon = 0.00001;
    if (desvioPct > epsilon) {
      cor = 'verde';
      simbolo = '▲';
      rotuloCurto = 'acima';
    } else if (desvioPct < -epsilon) {
      cor = 'vermelho';
      simbolo = '▼';
      rotuloCurto = 'abaixo';
    } else {
      cor = 'preto';
      simbolo = '●';
      rotuloCurto = 'na mediana';
    }

    const rotulo =
      comp.faixa_rotulo ||
      (cor === 'verde'
        ? 'Acima da mediana'
        : cor === 'vermelho'
          ? 'Abaixo da mediana'
          : 'Na mediana nacional');

    const nTexto = comp.n ? ` em ${formatarNumero(comp.n)} cidades` : '';
    const medianaTexto =
      comp.mediana !== undefined && comp.mediana !== null
        ? ` · Mediana dos municípios: ${formatarMoeda(comp.mediana)}${nTexto}`
        : '';
    const fonteTexto = comp.fonte_titulo ? ` · ${comp.fonte_titulo}` : '';

    const nomeMetrica = ROTULOS_METRICAS_ECONOMIA[chave];
    let tooltip: string;
    let ariaLabel: string;

    if (temRanking && posicao) {
      const qTexto = rotuloQuartil ? ` · ${rotuloQuartil}` : '';
      const fatTexto = fatorMediana ? ` · ${formatarNota(fatorMediana)}x a mediana municipal` : '';
      const tipoNome =
        chave === 'pib_total'
          ? 'maior PIB'
          : chave === 'receita_bruta'
            ? 'maior orçamento de receitas'
            : 'maior volume de despesas';
      tooltip = `${formatarNumero(posicao)}º ${tipoNome} entre ${formatarNumero(posicaoTotal)} municípios do Brasil${qTexto}${fatTexto}${medianaTexto}${fonteTexto}`;
      ariaLabel = `${nomeMetrica}: ${formatarMoeda(comp.valor)}. ${formatarNumero(posicao)}º no país entre ${formatarNumero(posicaoTotal)} cidades (${rotuloQuartil || rotulo}).`;
    } else if (ehAbsoluta) {
      const posTexto = posicao ? ` (${formatarNumero(posicao)}º no país)` : '';
      tooltip = `${formatarNota(fatorMediana)}x a mediana nacional${posTexto} · ${rotulo}${medianaTexto}${fonteTexto}`;
      ariaLabel = `${nomeMetrica}: ${formatarMoeda(comp.valor)}. ${formatarNota(fatorMediana)} vezes a mediana nacional (${valorFormatado}). ${rotulo}.`;
    } else {
      const posTexto = posicao ? ` (${formatarNumero(posicao)}º no país)` : '';
      tooltip = `Diferença da mediana nacional: ${valorFormatado}${posTexto} · ${rotulo}${medianaTexto}${fonteTexto}`;
      ariaLabel = `${nomeMetrica}: ${formatarMoeda(comp.valor)}. Diferença da mediana nacional: ${valorFormatado}. ${rotulo}.`;
    }

    return {
      desvio,
      desvioPct,
      fatorMediana,
      posicao,
      posicaoTotal,
      quartil,
      rotuloQuartil,
      valorFormatado,
      cor,
      simbolo,
      rotulo,
      rotuloCurto,
      mediana: comp.mediana,
      n: comp.n,
      tooltip,
      ariaLabel,
    };
  }

  temBenchmark(): boolean {
    const compEco = this.secao()?.benchmark?.comparacoes;
    const compFin = this.secaoFinancas()?.benchmark?.comparacoes;
    return (
      (!!compEco && Object.keys(compEco).length > 0) ||
      (!!compFin && Object.keys(compFin).length > 0)
    );
  }
}
