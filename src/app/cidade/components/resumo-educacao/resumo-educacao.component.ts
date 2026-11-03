import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import {
  FonteMeta,
  ResumoEducacaoDados,
  ResumoEscolarizacaoDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { formatarPct } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-resumo-educacao',
  imports: [KeyValuePipe, CabecalhoSecaoComponent],
  templateUrl: './resumo-educacao.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoEducacaoComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoEducacaoDados>>();
  readonly secaoEscolarizacao = input<SecaoEnvelope<ResumoEscolarizacaoDados> | null | undefined>(
    null,
  );
  readonly fonte = input<FonteMeta | undefined>(undefined);

  protected readonly formatarPct = formatarPct;
}
