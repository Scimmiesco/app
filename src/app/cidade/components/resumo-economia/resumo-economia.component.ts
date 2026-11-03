import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FonteMeta, ResumoEconomiaDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarMoeda } from '../../../core/utils/formatadores';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';

@Component({
  selector: 'app-resumo-economia',
  imports: [CabecalhoSecaoComponent],
  templateUrl: './resumo-economia.component.html',
  styleUrl: './resumo-economia.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoEconomiaComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoEconomiaDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);

  protected readonly formatarMoeda = formatarMoeda;
}
