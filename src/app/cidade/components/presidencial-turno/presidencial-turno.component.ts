import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { EleicaoPresidencialDados } from '../../../core/models/contrato.model';
import { formatarNumero, formatarPct, getCorPartido } from '../../../core/utils/formatadores';
import { PartidoBadgeComponent } from '../../../shared/components/partido-badge/partido-badge.component';

interface CandidatoPresidencial {
  chave: string;
  nome: string;
  partido: string;
  numero: string;
  votos: number;
  pct: number;
}

@Component({
  selector: 'app-presidencial-turno',
  imports: [PartidoBadgeComponent],
  templateUrl: './presidencial-turno.component.html',
  styleUrl: './presidencial-turno.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresidencialTurnoComponent {
  readonly dados = input.required<EleicaoPresidencialDados>();
  readonly turno = input.required<1 | 2>();

  readonly sufixo = computed<string>(() => this.turno() + 't');
  readonly sufixoNumero = computed<string>(() => (this.turno() === 2 ? '-2t' : ''));

  readonly pctOutros = computed<number>(() => {
    if (this.turno() === 2) return 0;
    return Math.max(0, 100 - (this.dados().pct_lula + this.dados().pct_flavio));
  });

  readonly candidatos = computed<CandidatoPresidencial[]>(() => [
    {
      chave: 'flavio',
      nome: 'Flávio Bolsonaro',
      partido: 'PL',
      numero: '22',
      votos: this.dados().flavio,
      pct: this.dados().pct_flavio,
    },
    {
      chave: 'lula',
      nome: 'Lula',
      partido: 'PT',
      numero: '13',
      votos: this.dados().lula,
      pct: this.dados().pct_lula,
    },
  ]);

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarPct = formatarPct;
  readonly cor = getCorPartido;
}
