import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ParlamentarItem } from '../../../core/models/contrato.model';
import {
  resolverTagParlamentar,
  TagParlamentar,
  tentouENaoSeElegeu,
} from '../../../core/utils/status-parlamentar';
import { CandidatoAvatarComponent } from '../candidato-avatar/candidato-avatar.component';
import { PartidoBadgeComponent } from '../partido-badge/partido-badge.component';
import { NumeroCandidatoComponent } from '../numero-candidato/numero-candidato.component';

@Component({
  selector: 'app-cartao-parlamentar',
  imports: [CandidatoAvatarComponent, PartidoBadgeComponent, NumeroCandidatoComponent],
  templateUrl: './cartao-parlamentar.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartaoParlamentarComponent {
  readonly parlamentar = input.required<ParlamentarItem>();
  readonly anoPleito = input<number>(2026);
  readonly cargo = input<string | null>(null);
  readonly tamanhoNomeLg = input<boolean>(false);

  readonly tag = computed<TagParlamentar | null>(() =>
    resolverTagParlamentar(this.parlamentar(), this.anoPleito()),
  );

  readonly naoEleito = computed<boolean>(() => tentouENaoSeElegeu(this.parlamentar()));
}
