import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export const NOMES_PARTIDOS: Record<string, string> = {
  PT: 'Partido dos Trabalhadores',
  PL: 'Partido Liberal',
  UNIÃO: 'União Brasil',
  UNIAO: 'União Brasil',
  PP: 'Progressistas',
  PSDB: 'PSDB',
  MDB: 'Movimento Democrático Brasileiro',
  REPUBLICANOS: 'Republicanos',
  PDT: 'Partido Democrático Trabalhista',
  PSB: 'Partido Socialista Brasileiro',
  PSD: 'Partido Social Democrático',
  PODE: 'Podemos',
  AVANTE: 'Avante',
  NOVO: 'Partido Novo',
  PSOL: 'PSOL',
  DC: 'Democracia Cristã',
  CIDADANIA: 'Cidadania',
  SOLIDARIEDADE: 'Solidariedade',
  PCdoB: 'PCdoB',
  PV: 'Partido Verde',
  REDE: 'Rede Sustentabilidade',
  PROS: 'PROS',
};

@Component({
  selector: 'app-partido-badge',
  standalone: true,
  template: `
    <span
      class="badge badge-xs badge-partido"
      [attr.data-partido]="siglaNormalizada()"
      [attr.title]="nomeCompleto()"
      [attr.aria-label]="nomeCompleto()"
      data-testid="badge-partido"
      >{{ sigla().trim() }}</span
    >
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartidoBadgeComponent {
  readonly sigla = input.required<string>();

  readonly siglaNormalizada = computed(() => (this.sigla() || '').trim().toUpperCase());

  readonly nomeCompleto = computed(() => {
    const siglaNorm = this.siglaNormalizada();
    const nome = NOMES_PARTIDOS[siglaNorm];
    const siglaOriginal = this.sigla().trim();
    return nome ? `${nome} (${siglaOriginal})` : `Partido ${siglaOriginal}`;
  });
}
