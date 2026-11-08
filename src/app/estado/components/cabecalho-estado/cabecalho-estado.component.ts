import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EstadoCabecalhoDados,
  EstadoItemIndice,
  EstadoMeta,
  FonteMeta,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { DataService } from '../../../core/services/data.service';
import { EsquemaTema, ThemeService } from '../../../core/services/theme.service';
import { formatarNumero } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-cabecalho-estado',
  imports: [RouterLink],
  templateUrl: './cabecalho-estado.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoEstadoComponent {
  private readonly dataService = inject(DataService);
  private readonly themeService = inject(ThemeService);

  readonly estado = input.required<EstadoMeta>();
  readonly secao = input<SecaoEnvelope<EstadoCabecalhoDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly estados = input<EstadoItemIndice[]>([]);
  readonly siglaUf = input<string>('MS');

  readonly estadoSelecionado = output<string>();

  readonly temaEscuro = this.themeService.temaEscuro;

  readonly siglaAtiva = computed(() => {
    return (this.siglaUf() || this.estado().sigla || 'MS').toUpperCase();
  });

  readonly codigoRetornoMunicipal = computed(() => {
    const estadoSigla = this.estado().sigla;
    const ultimo = this.dataService.getUltimoMunicipio(estadoSigla);
    return ultimo || String(this.estado().capital.codigo_ibge);
  });

  protected readonly formatarNumero = formatarNumero;

  definirTema(esquema: EsquemaTema): void {
    this.themeService.definirTema(esquema);
  }

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
