import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { EleicaoPresidencialDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import {
  formatarNumero,
  formatarPct,
  formatarVariacaoPct,
  formatarVariacaoVotos,
  getCorPartido,
} from '../../../core/utils/formatadores';
import { calcularComparativoPresidencial } from '../../../core/utils/comparativo-presidencial';
import { PartidoBadgeComponent } from '../../../shared/components/partido-badge/partido-badge.component';

@Component({
  selector: 'app-presidencial-comparativo',
  imports: [PartidoBadgeComponent],
  templateUrl: './presidencial-comparativo.component.html',
  styleUrl: './presidencial-comparativo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresidencialComparativoComponent {
  readonly secao1t = input<SecaoEnvelope<EleicaoPresidencialDados>>();
  readonly secao2t = input<SecaoEnvelope<EleicaoPresidencialDados>>();

  readonly comparativo = computed(() =>
    calcularComparativoPresidencial(this.secao1t(), this.secao2t()),
  );

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarPct = formatarPct;
  protected readonly formatarVariacaoVotos = formatarVariacaoVotos;
  protected readonly formatarVariacaoPct = formatarVariacaoPct;
  readonly cor = getCorPartido;
}
