import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import {
  EducacaoItemBenchmark,
  FonteMeta,
  ResumoEducacaoDados,
  ResumoEscolarizacaoDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { formatarIndice, formatarNumero, formatarPct } from '../../../core/utils/formatadores';

export interface IndicadorNacionalEducacao {
  indice: number;
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
  readonly secao = input.required<SecaoEnvelope<ResumoEducacaoDados>>();
  readonly secaoEscolarizacao = input<SecaoEnvelope<ResumoEscolarizacaoDados> | null | undefined>(
    null,
  );
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

    // A variação é expressa na escala normalizada de 0 a 1 (percentil / 100)
    const indice = Math.round(comp.percentil) / 100;
    const valorFormatado = formatarIndice(indice);

    // Mapeamento da cor semântica e símbolo (verde = acima/melhor, vermelho = abaixo, preto = mediana/próximo)
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
      rotuloCurto = 'mediana';
    } else {
      // Fallback defensivo baseado no centro da escala (0,50)
      if (indice > 0.55) {
        cor = 'verde';
        simbolo = '▲';
        rotuloCurto = 'melhor';
      } else if (indice < 0.45) {
        cor = 'vermelho';
        simbolo = '▼';
        rotuloCurto = 'abaixo';
      } else {
        cor = 'preto';
        simbolo = '●';
        rotuloCurto = 'mediana';
      }
    }

    const rotulo =
      comp.faixa_rotulo ||
      (cor === 'verde'
        ? 'Acima da mediana'
        : cor === 'vermelho'
          ? 'Abaixo da mediana'
          : 'Na mediana');

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

    const tooltip = `Posição nacional: ${valorFormatado} (escala 0 a 1) · ${rotulo}${medianaTexto} · IDEB 2025`;
    const ariaLabel = `${rede}: nota ${comp.valor}. Posição nacional: ${valorFormatado} de 0 a 1. ${rotulo}.`;

    return {
      indice,
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

  temBenchmark(etapa: 'anos_iniciais' | 'anos_finais'): boolean {
    const comparacoes = this.secao().benchmark?.comparacoes?.[etapa];
    return !!comparacoes && Object.keys(comparacoes).length > 0;
  }
}
