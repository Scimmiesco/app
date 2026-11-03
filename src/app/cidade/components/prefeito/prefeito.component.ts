import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ParlamentarItem, SecaoEnvelope } from '../../../core/models/contrato.model';
import { formatarNumero } from '../../../core/utils/formatadores';
import { ordenarParlamentares } from '../../../core/utils/ordenar-parlamentares';
import { CandidatoAvatarComponent } from '../../../shared/components/candidato-avatar/candidato-avatar.component';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { NumeroCandidatoComponent } from '../../../shared/components/numero-candidato/numero-candidato.component';
import { PartidoBadgeComponent } from '../../../shared/components/partido-badge/partido-badge.component';

@Component({
  selector: 'app-prefeito',
  imports: [
    CandidatoAvatarComponent,
    CabecalhoSecaoComponent,
    NumeroCandidatoComponent,
    PartidoBadgeComponent,
  ],
  templateUrl: './prefeito.component.html',
  styleUrl: './prefeito.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrefeitoComponent {
  readonly secao = input.required<SecaoEnvelope<ParlamentarItem[]>>();

  readonly prefeito = computed<ParlamentarItem[]>(() => ordenarParlamentares(this.secao().dados));

  protected readonly formatarNumero = formatarNumero;
}
