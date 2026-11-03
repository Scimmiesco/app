import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import {
  FonteMeta,
  MapaMeta,
  ResumoIbgeDados,
  ResumoPopulacaoEstimadaDados,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { formatarNumero, formatarPct } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-resumo-ibge',
  imports: [KeyValuePipe],
  templateUrl: './resumo-ibge.component.html',
  styleUrl: './resumo-ibge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoIbgeComponent {
  readonly secao = input.required<SecaoEnvelope<ResumoIbgeDados>>();
  readonly secaoPopEst = input<SecaoEnvelope<ResumoPopulacaoEstimadaDados> | null | undefined>(
    null,
  );
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly mapa = input<MapaMeta | undefined>(undefined);
  readonly nomeMunicipio = input<string>('');

  readonly mostrarMapa = signal<boolean>(false);

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarPct = formatarPct;

  toggleMapa(): void {
    this.mostrarMapa.update((aberto) => !aberto);
  }
}
