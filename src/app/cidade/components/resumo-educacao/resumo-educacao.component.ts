import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import {
  EducacaoBenchmark,
  EducacaoItemBenchmark,
  EscolarizacaoBenchmark,
  FonteMeta,
  ResumoEducacaoDados,
  ResumoEscolarizacaoDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import {
  formatarDesvio,
  formatarNumero,
  formatarPct,
  formatarVariacaoPct,
} from '../../../core/utils/formatadores';

export interface IndicadorNacionalEducacao {
  /** Desvio em relação à mediana nacional */
  desvio: number;
  /** Desvio formatado com sinal (ex.: "+0,7", "-1,3", "0,0" ou "+0,22 p.p.") */
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
  selector: 'app-resumo-educacao',
  imports: [KeyValuePipe, CabecalhoSecaoComponent],
  templateUrl: './resumo-educacao.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoEducacaoComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoEducacaoDados, EducacaoBenchmark>>();
  readonly secaoEscolarizacao = input<
    | SecaoEnvelope<ResumoEscolarizacaoDados, EducacaoItemBenchmark | EscolarizacaoBenchmark>
    | null
    | undefined
  >(null);
  readonly fonte = input<FonteMeta | undefined>(undefined);

  protected readonly formatarPct = formatarPct;

  obterIndicador(
    etapa: 'anos_iniciais' | 'anos_finais',
    rede: string,
  ): IndicadorNacionalEducacao | null {
    const benchmark = this.secao().benchmark;
    if (!benchmark || !benchmark.comparacoes) return null;

    const etapaComparacoes = benchmark.comparacoes[etapa];
    if (!etapaComparacoes) return null;

    const comp: EducacaoItemBenchmark | undefined = etapaComparacoes[rede];
    if (!comp || comp.desvio_mediana === undefined || comp.desvio_mediana === null) return null;

    const desvio = comp.desvio_mediana;
    const valorFormatado = formatarDesvio(desvio);

    let cor: 'verde' | 'vermelho' | 'preto';
    let simbolo: string;
    let rotuloCurto: string;

    const epsilon = 0.00001;
    if (desvio > epsilon) {
      cor = 'verde';
      simbolo = '▲';
      rotuloCurto = 'acima';
    } else if (desvio < -epsilon) {
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
        ? ` · Mediana dos municípios: ${formatarNumero(comp.mediana)}${nTexto}`
        : '';

    const tooltip = `Diferença da mediana nacional: ${valorFormatado} · ${rotulo}${medianaTexto} · IDEB 2025`;
    const ariaLabel = `${rede}: nota IDEB ${comp.valor}. Diferença da mediana nacional: ${valorFormatado}. ${rotulo}.`;

    return {
      desvio,
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

  obterIndicadorEscolarizacao(): IndicadorNacionalEducacao | null {
    const sEsc = this.secaoEscolarizacao();
    if (!sEsc) return null;
    const bench = sEsc.benchmark;
    if (!bench) return null;

    const comp: EducacaoItemBenchmark | undefined =
      'desvio_mediana' in bench
        ? (bench as EducacaoItemBenchmark)
        : (bench as EscolarizacaoBenchmark).comparacao;
    if (!comp || comp.desvio_mediana === undefined || comp.desvio_mediana === null) return null;

    const desvio = comp.desvio_mediana;
    const valorFormatado = formatarVariacaoPct(desvio);

    let cor: 'verde' | 'vermelho' | 'preto';
    let simbolo: string;
    let rotuloCurto: string;

    const epsilon = 0.00001;
    if (desvio > epsilon) {
      cor = 'verde';
      simbolo = '▲';
      rotuloCurto = 'acima';
    } else if (desvio < -epsilon) {
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
        ? ` · Mediana dos municípios: ${formatarPct(comp.mediana)}${nTexto}`
        : '';

    const tooltip = `Diferença da mediana nacional: ${valorFormatado} · ${rotulo}${medianaTexto} · Censo Demográfico 2022 (IBGE)`;
    const ariaLabel = `Taxa de Escolarização: ${formatarPct(comp.valor)}. Diferença da mediana nacional: ${valorFormatado}. ${rotulo}.`;

    return {
      desvio,
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
    const comparacoesEdu = this.secao().benchmark?.comparacoes;
    const temEdu =
      !!comparacoesEdu &&
      (Object.keys(comparacoesEdu['anos_iniciais'] || {}).length > 0 ||
        Object.keys(comparacoesEdu['anos_finais'] || {}).length > 0);
    const temEsc = !!this.secaoEscolarizacao()?.benchmark;
    return temEdu || temEsc;
  }
}
