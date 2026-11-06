import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EstadoCabecalhoDados,
  EstadoItemIndice,
  EstadoMeta,
  FonteMeta,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { formatarNumero } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-cabecalho-estado',
  imports: [RouterLink],
  templateUrl: './cabecalho-estado.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoEstadoComponent {
  readonly estado = input.required<EstadoMeta>();
  readonly secao = input<SecaoEnvelope<EstadoCabecalhoDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly estados = input<EstadoItemIndice[]>([]);
  readonly siglaUf = input<string>('MS');

  readonly estadoSelecionado = output<string>();

  readonly siglaAtiva = computed(() => {
    return (this.siglaUf() || this.estado().sigla || 'MS').toUpperCase();
  });

  protected readonly formatarNumero = formatarNumero;

  eEstadoAtivo(sigla: string): boolean {
    return sigla.toUpperCase() === this.siglaAtiva();
  }

  aoSelecionarEstado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const novaSigla = select.value;
    if (novaSigla) {
      this.estadoSelecionado.emit(novaSigla);
    }
  }
}
