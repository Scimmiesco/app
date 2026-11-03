import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import {
  EleicaoPresidencialDados,
  FonteMeta,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { PresidencialComparativoComponent } from '../presidencial-comparativo/presidencial-comparativo.component';
import { PresidencialTurnoComponent } from '../presidencial-turno/presidencial-turno.component';

export type AbaPresidencial = '1t' | '2t' | 'comparativo';

@Component({
  selector: 'app-eleicao-presidencial',
  imports: [PresidencialTurnoComponent, PresidencialComparativoComponent],
  templateUrl: './eleicao-presidencial.component.html',
  styleUrl: './eleicao-presidencial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EleicaoPresidencialComponent {
  readonly secao1t = input<SecaoEnvelope<EleicaoPresidencialDados>>();
  readonly secao2t = input<SecaoEnvelope<EleicaoPresidencialDados>>();
  readonly fonte1t = input<FonteMeta | undefined>(undefined);
  readonly fonte2t = input<FonteMeta | undefined>(undefined);

  readonly abaPresidencial = signal<AbaPresidencial>('1t');

  selecionarAbaPresidencial(aba: AbaPresidencial): void {
    this.abaPresidencial.set(aba);
  }
}
