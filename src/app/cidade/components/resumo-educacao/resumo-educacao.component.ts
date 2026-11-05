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
import { formatarNota, formatarNumero, formatarPct } from '../../../core/utils/formatadores';

export interface IndicadorNacionalEducacao {
  /** Nota de 0 a 10 (ex.: 8.1, 5.0, 3.0, 0.5) calculada a partir do percentil nacional */
  nota: number;
  /** Nota formatada (ex.: "8,1", "5,0", "3,0", "0,5") */
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
    if (!comp || comp.percentil === undefined || comp.percentil === null) return null;

    // A posição nacional é convertida em nota de 0 a 10 (percentil / 10),
    // onde 5,0 representa a média/mediana exata dos municípios brasileiros.
    const nota = Math.round(comp.percentil) / 10;
    const valorFormatado = formatarNota(nota);

    // Mapeamento da cor semântica e símbolo (verde = acima/melhor, vermelho = abaixo, preto = média 5/próximo)
    let cor: 'verde' | 'vermelho' | 'preto';
    let simbolo: string;
    let rotuloCurto: string;

    const faixa = comp.faixa?.toLowerCase();
    if (faixa === 'acima' || faixa === 'muito_acima') {
      cor = 'verde';
      simbolo = '▲';
      rotuloCurto = 'melhor';
    } else if (faixa === 'abaixo' || faixa === 'muito_abaixo') {
      cor = 'vermelho';
      simbolo = '▼';
      rotuloCurto = 'abaixo';
    } else if (faixa === 'proximo') {
      cor = 'preto';
      simbolo = '●';
      rotuloCurto = 'na média';
    } else {
      // Fallback defensivo baseado na nota 5,0 (média)
      if (nota >= 5.5) {
        cor = 'verde';
        simbolo = '▲';
        rotuloCurto = 'melhor';
      } else if (nota <= 4.5) {
        cor = 'vermelho';
        simbolo = '▼';
        rotuloCurto = 'abaixo';
      } else {
        cor = 'preto';
        simbolo = '●';
        rotuloCurto = 'na média';
      }
    }

    const rotulo =
      comp.faixa_rotulo ||
      (cor === 'verde'
        ? 'Acima da mediana'
        : cor === 'vermelho'
          ? 'Abaixo da mediana'
          : 'Na média nacional');

    const deltaSinal = comp.desvio_mediana > 0 ? '+' : '';
    const deltaTexto =
      comp.desvio_mediana !== undefined && comp.desvio_mediana !== null
        ? ` (${deltaSinal}${formatarNumero(comp.desvio_mediana)})`
        : '';
    const nTexto = comp.n ? ` em ${formatarNumero(comp.n)} cidades` : '';
    const medianaTexto =
      comp.mediana !== undefined && comp.mediana !== null
        ? ` · Mediana dos municípios: ${formatarNumero(comp.mediana)}${deltaTexto}${nTexto}`
        : '';

    const tooltip = `Posição nacional: nota ${valorFormatado} (escala 0 a 10) · ${rotulo}${medianaTexto} · IDEB 2025`;
    const ariaLabel = `${rede}: nota IDEB ${comp.valor}. Posição nacional: nota ${valorFormatado} de 0 a 10. ${rotulo}.`;

    return {
      nota,
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
      'percentil' in bench
        ? (bench as EducacaoItemBenchmark)
        : (bench as EscolarizacaoBenchmark).comparacao;
    if (!comp || comp.percentil === undefined || comp.percentil === null) return null;

    const nota = Math.round(comp.percentil) / 10;
    const valorFormatado = formatarNota(nota);

    let cor: 'verde' | 'vermelho' | 'preto';
    let simbolo: string;
    let rotuloCurto: string;

    const faixa = comp.faixa?.toLowerCase();
    if (faixa === 'acima' || faixa === 'muito_acima') {
      cor = 'verde';
      simbolo = '▲';
      rotuloCurto = 'melhor';
    } else if (faixa === 'abaixo' || faixa === 'muito_abaixo') {
      cor = 'vermelho';
      simbolo = '▼';
      rotuloCurto = 'abaixo';
    } else if (faixa === 'proximo') {
      cor = 'preto';
      simbolo = '●';
      rotuloCurto = 'na média';
    } else {
      if (nota >= 5.5) {
        cor = 'verde';
        simbolo = '▲';
        rotuloCurto = 'melhor';
      } else if (nota <= 4.5) {
        cor = 'vermelho';
        simbolo = '▼';
        rotuloCurto = 'abaixo';
      } else {
        cor = 'preto';
        simbolo = '●';
        rotuloCurto = 'na média';
      }
    }

    const rotulo =
      comp.faixa_rotulo ||
      (cor === 'verde'
        ? 'Acima da mediana'
        : cor === 'vermelho'
          ? 'Abaixo da mediana'
          : 'Na média nacional');

    const deltaSinal = comp.desvio_mediana > 0 ? '+' : '';
    const deltaTexto =
      comp.desvio_mediana !== undefined && comp.desvio_mediana !== null
        ? ` (${deltaSinal}${formatarPct(comp.desvio_mediana)})`
        : '';
    const nTexto = comp.n ? ` em ${formatarNumero(comp.n)} cidades` : '';
    const medianaTexto =
      comp.mediana !== undefined && comp.mediana !== null
        ? ` · Mediana dos municípios: ${formatarPct(comp.mediana)}${deltaTexto}${nTexto}`
        : '';

    const tooltip = `Posição nacional: nota ${valorFormatado} (escala 0 a 10) · ${rotulo}${medianaTexto} · Censo Demográfico 2022 (IBGE)`;
    const ariaLabel = `Taxa de Escolarização: ${formatarPct(comp.valor)}. Posição nacional: nota ${valorFormatado} de 0 a 10. ${rotulo}.`;

    return {
      nota,
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
