import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NumeroHistorico } from '../../../core/models/contrato.model';
import { getCorPartido, getNumeroPrefixo, getNumeroResto } from '../../../core/utils/formatadores';

@Component({
  selector: 'app-numero-candidato',
  imports: [],
  templateUrl: './numero-candidato.component.html',
  styleUrl: './numero-candidato.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumeroCandidatoComponent {
  readonly numero = input<string | number | null | undefined>(null);
  readonly historico = input<NumeroHistorico | null | undefined>(null);
  readonly partido = input<string>('');

  readonly numeroAtual = computed<string | null>(() => {
    const valor = this.numero();
    if (valor === null || valor === undefined) return null;
    const texto = String(valor).trim();
    return texto.length > 0 ? texto : null;
  });

  readonly cor = getCorPartido;
  protected readonly prefixo = getNumeroPrefixo;
  protected readonly resto = getNumeroResto;
}
