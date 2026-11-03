import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  styleUrl: './cabecalho-cidade.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoCidadeComponent {
  readonly municipio = input.required<MunicipioMeta>();
  readonly secao = input<SecaoEnvelope<CabecalhoDados>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly cidades = input<CidadeItemIndice[]>([]);
  readonly codigoIbge = input<string>('5002704');

  readonly cidadeSelecionada = output<string>();

  protected readonly formatarNumero = formatarNumero;

  aoSelecionarCidade(event: Event): void {
    const novoCodigo = (event.target as HTMLSelectElement).value;
    if (novoCodigo) {
      this.cidadeSelecionada.emit(novoCodigo);
    }
  }
}
