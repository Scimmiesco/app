import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  CabecalhoDados,
  CidadeItemIndice,
  FonteMeta,
  MunicipioMeta,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import { formatarNumero } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-cabecalho-cidade',
  imports: [],
  templateUrl: './cabecalho-cidade.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoCidadeComponent {
  readonly municipio = input.required<MunicipioMeta>();
  readonly secao = input<SecaoEnvelope<CabecalhoDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly cidades = input<CidadeItemIndice[]>([]);
  readonly codigoIbge = input<string>('5002704');

  readonly cidadeSelecionada = output<string>();

  readonly codigoAtivo = computed(() => {
    return String(this.codigoIbge() || this.municipio().codigo_ibge || '5002704');
  });

  protected readonly formatarNumero = formatarNumero;

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
