import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FonteMeta,
  MunicipioItemDestaque,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { CabecalhoSecaoComponent } from '../../../shared/components/cabecalho-secao/cabecalho-secao.component';
import { formatarNumero } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-municipios-estado',
  imports: [RouterLink, CabecalhoSecaoComponent],
  templateUrl: './municipios-estado.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MunicipiosEstadoComponent {
  readonly secao = input.required<SecaoEnvelope<MunicipioItemDestaque[]>>();
  readonly siglaUf = input.required<string>();
  readonly fonte = input<FonteMeta | undefined>(undefined);

  protected readonly formatarNumero = formatarNumero;
}
