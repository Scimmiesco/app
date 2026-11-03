import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { FonteMeta, ResumoEducacaoDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';

@Component({
  selector: 'app-resumo-educacao',
  imports: [KeyValuePipe, CabecalhoSecaoComponent],
  templateUrl: './resumo-educacao.component.html',
  styleUrl: './resumo-educacao.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoEducacaoComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoEducacaoDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);
}
