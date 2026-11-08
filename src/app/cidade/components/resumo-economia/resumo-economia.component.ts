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
  /** Valor formatado para exibição: "+57,4%" (per capita) ou "137x" (totais brutos) */
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
    const desvioPct = comp.desvio_pct_mediana;
    const desvio = comp.desvio_mediana ?? 0;
    const fatorMediana = comp.fator_mediana;
    const valorFormatado = ehAbsoluta
      ? formatarMultiplicador(fatorMediana)
      : formatarDesvioPct(desvioPct);

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
    const tooltip = ehAbsoluta
      ? `${formatarNota(fatorMediana)}x a mediana nacional · ${rotulo}${medianaTexto}${fonteTexto}`
      : `Diferença da mediana nacional: ${valorFormatado} · ${rotulo}${medianaTexto}${fonteTexto}`;
    const ariaLabel = ehAbsoluta
      ? `${nomeMetrica}: ${formatarMoeda(comp.valor)}. ${formatarNota(fatorMediana)} vezes a mediana nacional (${valorFormatado}). ${rotulo}.`
      : `${nomeMetrica}: ${formatarMoeda(comp.valor)}. Diferença da mediana nacional: ${valorFormatado}. ${rotulo}.`;

    return {
      desvio,
      desvioPct,
      fatorMediana,
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
