import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarNumero } from '../../../core/utils/formatadores';
import { ordenarParlamentares } from '../../../core/utils/ordenar-parlamentares';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { CartaoParlamentarComponent } from '../../../shared/components/cartao-parlamentar/cartao-parlamentar.component';

@Component({
  selector: 'app-prefeito',
  imports: [CabecalhoSecaoComponent, CartaoParlamentarComponent],
  templateUrl: './prefeito.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrefeitoComponent {
  readonly secao = input.required<SecaoEnvelope<ParlamentarItem[]>>();

  readonly prefeito = computed<ParlamentarItem[]>(() => ordenarParlamentares(this.secao().dados));

  protected readonly formatarNumero = formatarNumero;
}
