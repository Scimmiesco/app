import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FonteMeta, SecaoEnvelope } from '../../../core/models/contrato.model';

@Component({
  selector: 'app-cabecalho-secao',
  imports: [],
  templateUrl: './cabecalho-secao.component.html',
  styleUrl: './cabecalho-secao.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabecalhoSecaoComponent {
  readonly secao = input.required<SecaoEnvelope<unknown>>();
  readonly fonte = input<FonteMeta | undefined>(undefined);
  readonly kickerTestId = input<string | null>(null);
  readonly tituloTestId = input<string | null>(null);
  readonly badgeTestId = input<string | null>(null);
  readonly linkTestId = input<string | null>(null);
  readonly mandatoTestId = input<string | null>(null);
  readonly mostrarFonte = input<boolean>(true);
  readonly mostrarMandato = input<boolean>(false);
  readonly textoCurado = input<boolean>(false);
  readonly curadoComoPendente = input<boolean>(false);
  readonly categoriaPadrao = input<string>('A CIDADE');
}
