import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ParlamentarItem } from '../../../core/models/contrato.model';
import {
  ContextoTagParlamentar,
  resolverTagParlamentar,
  TagParlamentar,
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
  readonly contexto = input.required<ContextoTagParlamentar>();
  readonly tagTestId = input<string | null>(null);
  readonly cargo = input<string | null>(null);
  readonly tamanhoNomeLg = input<boolean>(false);

  readonly tag = computed<TagParlamentar | null>(() => {
    const resolvida = resolverTagParlamentar(this.parlamentar(), this.contexto());
    if (!resolvida) return null;
    const testId = this.tagTestId();
    if (testId && !resolvida.testId) return { ...resolvida, testId };
    return resolvida;
  });
}
