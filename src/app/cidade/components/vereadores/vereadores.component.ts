import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarNumero, formatarPct } from '../../../core/utils/formatadores';
import { ordenarParlamentares } from '../../../core/utils/ordenar-parlamentares';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { CartaoParlamentarComponent } from '../../../shared/components/cartao-parlamentar/cartao-parlamentar.component';

@Component({
  selector: 'app-vereadores',
  imports: [CabecalhoSecaoComponent, CartaoParlamentarComponent],
  templateUrl: './vereadores.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VereadoresComponent {
  readonly secao = input.required<SecaoEnvelope<ParlamentarItem[]>>();

  readonly vereadores = computed<ParlamentarItem[]>(() => ordenarParlamentares(this.secao().dados));

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarPct = formatarPct;
}
