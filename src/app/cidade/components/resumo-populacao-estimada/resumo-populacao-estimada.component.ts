import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  FonteMeta,
  ResumoPopulacaoEstimadaDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { formatarNumero } from '../../../core/utils/formatadores';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';

@Component({
  selector: 'app-resumo-populacao-estimada',
  imports: [CabecalhoSecaoComponent],
  templateUrl: './resumo-populacao-estimada.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoPopulacaoEstimadaComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoPopulacaoEstimadaDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);

  protected readonly formatarNumero = formatarNumero;
}
