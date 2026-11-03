import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import {
  FonteMeta,
  MapaMeta,
  ResumoIbgeDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { formatarMoeda, formatarNumero, formatarPct } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-resumo-ibge',
  imports: [KeyValuePipe],
  templateUrl: './resumo-ibge.component.html',
  styleUrl: './resumo-ibge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoIbgeComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoIbgeDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly mapa = input<MapaMeta | undefined>(undefined);
  readonly nomeMunicipio = input<string>('');

  readonly mostrarMapa = signal<boolean>(false);

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarMoeda = formatarMoeda;
  protected readonly formatarPct = formatarPct;

  toggleMapa(): void {
    this.mostrarMapa.update((aberto) => !aberto);
  }
}
