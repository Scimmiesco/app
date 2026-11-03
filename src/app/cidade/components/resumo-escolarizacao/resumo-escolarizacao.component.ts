import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  FonteMeta,
  ResumoEscolarizacaoDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { formatarPct } from '../../../core/utils/formatadores';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';

@Component({
  selector: 'app-resumo-escolarizacao',
  imports: [CabecalhoSecaoComponent],
  templateUrl: './resumo-escolarizacao.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoEscolarizacaoComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoEscolarizacaoDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);

  protected readonly formatarPct = formatarPct;
}
