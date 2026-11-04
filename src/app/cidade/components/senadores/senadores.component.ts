import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FonteMeta, ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarDataIso } from '../../../core/utils/formatadores';
import { ordenarParlamentares } from '../../../core/utils/ordenar-parlamentares';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { CartaoParlamentarComponent } from '../../../shared/components/cartao-parlamentar/cartao-parlamentar.component';

@Component({
  selector: 'app-senadores',
  imports: [CabecalhoSecaoComponent, CartaoParlamentarComponent],
  templateUrl: './senadores.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SenadoresComponent {
  readonly secao = input.required<SecaoEnvelope<ParlamentarItem[]>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);

  readonly senadores = computed<ParlamentarItem[]>(() => ordenarParlamentares(this.secao().dados));

  protected readonly formatarDataIso = formatarDataIso;
}
