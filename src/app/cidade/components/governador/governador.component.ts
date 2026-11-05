import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FonteMeta, ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarDataIso, formatarNumero, formatarPct } from '../../../core/utils/formatadores';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { CartaoParlamentarComponent } from '../../../shared/components/cartao-parlamentar/cartao-parlamentar.component';

@Component({
  selector: 'app-governador',
  imports: [CabecalhoSecaoComponent, CartaoParlamentarComponent],
  templateUrl: './governador.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernadorComponent {
  readonly secao = input.required<SecaoEnvelope<ParlamentarItem[]>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);

  readonly governador = computed<ParlamentarItem[]>(() => {
    const itens = this.secao().dados;
    if (!itens || !Array.isArray(itens)) return [];
    // Regra: o candidato eleito no pleito de 2026 vem em primeiro lugar.
    // Quando houver troca de cargo (o eleito não é o governador atual),
    // o governador em exercício fica em uma linha abaixo do eleito.
    return [...itens].sort((a, b) => {
      const aEleito =
        a.status_eleicao_2026 === 'eleito' ||
        a.status_eleicao_2026 === 'reeleito' ||
        (a.votos ?? 0) > 0;
      const bEleito =
        b.status_eleicao_2026 === 'eleito' ||
        b.status_eleicao_2026 === 'reeleito' ||
        (b.votos ?? 0) > 0;
      if (aEleito && !bEleito) return -1;
      if (!aEleito && bEleito) return 1;

      return (b.votos ?? 0) - (a.votos ?? 0);
    });
  });

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarPct = formatarPct;
  protected readonly formatarDataIso = formatarDataIso;
}
