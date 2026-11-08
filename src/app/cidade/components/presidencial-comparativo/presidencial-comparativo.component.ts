import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  EleicaoPresidencialDados,
  FotoCandidato,
  SecaoEnvelope,
} from '../../../core/models/contrato.model';
import {
  formatarNumero,
  formatarPct,
  formatarVariacaoPct,
  formatarVariacaoVotos,
  getCorPartido,
} from '../../../core/utils/formatadores';
import { calcularComparativoPresidencial } from '../../../core/utils/comparativo-presidencial';
import { estaEmMandatoIntervalo } from '../../../core/utils/status-parlamentar';
import { CandidatoAvatarComponent } from '../../../shared/components/candidato-avatar/candidato-avatar.component';
import { NumeroCandidatoComponent } from '../../../shared/components/numero-candidato/numero-candidato.component';
import { PartidoBadgeComponent } from '../../../shared/components/partido-badge/partido-badge.component';

@Component({
  selector: 'app-presidencial-comparativo',
  imports: [PartidoBadgeComponent, CandidatoAvatarComponent, NumeroCandidatoComponent],
  templateUrl: './presidencial-comparativo.component.html',
  styleUrl: './presidencial-comparativo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresidencialComparativoComponent {
  readonly secao1t = input<SecaoEnvelope<EleicaoPresidencialDados>>();
  readonly secao2t = input<SecaoEnvelope<EleicaoPresidencialDados>>();

  readonly comparativo = computed(() =>
    calcularComparativoPresidencial(this.secao1t(), this.secao2t()),
  );

  // Lula: em mandato 2023-2026 e reeleito para 2027-2030
  readonly lulaEmMandato = computed(() => estaEmMandatoIntervalo('2023-01-01', '2030-12-31'));

  readonly fotoFlavio: FotoCandidato = {
    arquivo: 'fotos/tse2026_280002551544.jpg',
    fonte: 'TSE - Dados Abertos (fotos de candidatos 2026)',
    url: 'https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes2026/fotos/foto_cand2026_BR_div.zip',
    credito: 'TSE',
    ano: 2026,
    sha256: '71de3cb38649683cd62c596a9b3217c3d95a199380bfe3aae6fe7a8491369601',
    largura: 256,
    altura: 256,
  };

  readonly fotoLula: FotoCandidato = {
    arquivo: 'fotos/tse2026_280002542548.jpg',
    fonte: 'TSE - Dados Abertos (fotos de candidatos 2026)',
    url: 'https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes2026/fotos/foto_cand2026_BR_div.zip',
    credito: 'TSE',
    ano: 2026,
    sha256: '86b5d0c6587d43b3081340b4c8e62659d4dc3f26cb0b415c9a31bcc2c998d5d1',
    largura: 256,
    altura: 256,
  };

  protected readonly formatarNumero = formatarNumero;
  protected readonly formatarPct = formatarPct;
  protected readonly formatarVariacaoVotos = formatarVariacaoVotos;
  protected readonly formatarVariacaoPct = formatarVariacaoPct;
  readonly cor = getCorPartido;
}
