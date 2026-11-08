import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CabecalhoDados,
  CidadeItemIndice,
  FonteMeta,
  MunicipioMeta,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { EsquemaTema, ThemeService } from '../../../core/services/theme.service';
import { formatarEstado, formatarNumero } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-cabecalho-cidade',
  imports: [RouterLink],
  templateUrl: './cabecalho-cidade.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoCidadeComponent {
  private readonly themeService = inject(ThemeService);

  readonly municipio = input.required<MunicipioMeta>();
  readonly secao = input<SecaoEnvelope<CabecalhoDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly cidades = input<CidadeItemIndice[]>([]);
  readonly codigoIbge = input<string>('5002704');

  readonly cidadeSelecionada = output<string>();

  readonly temaEscuro = this.themeService.temaEscuro;

  readonly codigoAtivo = computed(() => {
    return String(this.codigoIbge() || this.municipio().codigo_ibge || '5002704');
  });

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarEstado = formatarEstado;

  definirTema(esquema: EsquemaTema): void {
    this.themeService.definirTema(esquema);
  }

  eCidadeAtiva(codigo: string | number): boolean {
    return String(codigo) === this.codigoAtivo();
  }

  aoSelecionarCidade(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const novoCodigo = select.value;
    if (novoCodigo) {
      this.cidadeSelecionada.emit(novoCodigo);
    }
  }
}
