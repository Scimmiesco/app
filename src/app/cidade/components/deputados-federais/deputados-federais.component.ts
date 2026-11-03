import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FonteMeta, ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarDataIso, formatarNumero, formatarPct } from '../../../core/utils/formatadores';
import { ordenarParlamentares } from '../../../core/utils/ordenar-parlamentares';
import { CartaoParlamentarComponent } from '../../../shared/components/cartao-parlamentar/cartao-parlamentar.component';

@Component({
  selector: 'app-deputados-federais',
  imports: [CartaoParlamentarComponent],
  templateUrl: './deputados-federais.component.html',
  styleUrl: './deputados-federais.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeputadosFederaisComponent {
  readonly secao = input.required<SecaoEnvelope<ParlamentarItem[]>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);

  readonly deputadosFederais = computed<ParlamentarItem[]>(() =>
    ordenarParlamentares(this.secao().dados),
  );

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarPct = formatarPct;
  protected readonly formatarDataIso = formatarDataIso;

  testIdLinha(parlamentar: ParlamentarItem): string {
    return 'linha-deputado-' + parlamentar.nome_urna.toLowerCase();
  }
}
