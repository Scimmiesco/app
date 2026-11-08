import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarNumero, formatarPct } from '../../../core/utils/formatadores';
import { ordenarParlamentares } from '../../../core/utils/ordenar-parlamentares';
import { estaEmMandatoNoMomento } from '../../../core/utils/status-parlamentar';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { CartaoParlamentarComponent } from '../../../shared/components/cartao-parlamentar/cartao-parlamentar.component';

@Component({
  selector: 'app-deputados-estaduais',
  imports: [CabecalhoSecaoComponent, CartaoParlamentarComponent],
  templateUrl: './deputados-estaduais.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeputadosEstaduaisComponent {
  readonly secao = input.required<SecaoEnvelope<ParlamentarItem[]>>();

  readonly deputadosEstaduais = computed<ParlamentarItem[]>(() =>
    ordenarParlamentares(this.secao().dados),
  );

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarPct = formatarPct;
  protected readonly estaEmMandatoNoMomento = estaEmMandatoNoMomento;
}
