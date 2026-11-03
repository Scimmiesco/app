import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  FonteMeta,
  ResumoEconomiaDados,
  ResumoFinancasDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { formatarMoeda } from '../../../core/utils/formatadores';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';

@Component({
  selector: 'app-resumo-economia',
  imports: [CabecalhoSecaoComponent],
  templateUrl: './resumo-economia.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoEconomiaComponent {
  readonly secao = input<SecaoEnvelope<ResumoEconomiaDados> | null | undefined>(null);
  readonly secaoFinancas = input<SecaoEnvelope<ResumoFinancasDados> | null | undefined>(null);
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly fonteFinancas = input<FonteMeta | undefined>(undefined);

  protected readonly formatarMoeda = formatarMoeda;
}
