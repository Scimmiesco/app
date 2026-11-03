import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FonteMeta, ResumoFinancasDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarMoeda } from '../../../core/utils/formatadores';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';

@Component({
  selector: 'app-resumo-financas',
  imports: [CabecalhoSecaoComponent],
  templateUrl: './resumo-financas.component.html',
  styleUrl: './resumo-financas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoFinancasComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoFinancasDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);

  protected readonly formatarMoeda = formatarMoeda;
}
