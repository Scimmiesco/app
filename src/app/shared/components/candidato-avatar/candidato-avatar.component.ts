import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FotoCandidato } from '../../../core/models/contrato.model';

const TITULOS_IGNORADOS = new Set([
  'DR',
  'DRA',
  'DR.',
  'DRA.',
  'PROF',
  'PROFA',
  'PROF.',
  'PROFA.',
  'CEL',
  'CEL.',
  'CAPITAO',
  'CAPITÃO',
  'PASTOR',
  'PASTORA',
  'PADRE',
  'DEPUTADO',
  'DEPUTADA',
  'VEREADOR',
  'VEREADORA',
  'CORONEL',
]);

@Component({
  selector: 'app-candidato-avatar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    @if (temFotoValida() && !erroImagem()) {
      <img
        [ngSrc]="caminhoFoto()"
        [width]="tamanho()"
        [height]="tamanho()"
        alt=""
        class="candidato-avatar-img shrink-0 object-cover select-none"
        [class.candidato-avatar-nao-eleito]="naoEleito()"
        [class.border-2]="comBorda()"
        [class.border-black]="comBorda()"
        [class.rounded-xs]="comBorda()"
        [class.shadow-default-sm]="comBorda()"
        [style.width.px]="tamanho()"
        [style.height.px]="tamanho()"
        (error)="aoOcorrerErro()"
        data-testid="candidato-avatar-img"
      />
    } @else {
      <div
        class="candidato-avatar-fallback shrink-0 font-black text-black flex items-center justify-center select-none"
        [class.candidato-avatar-nao-eleito]="naoEleito()"
        [class.border-2]="comBorda()"
        [class.border-black]="comBorda()"
        [class.rounded-xs]="comBorda()"
        [class.shadow-default-sm]="comBorda()"
        [style.width.px]="tamanho()"
        [style.height.px]="tamanho()"
        [style.fontSize.px]="tamanhoFonte()"
        [style.backgroundColor]="'#ffcc00'"
        aria-hidden="true"
        data-testid="candidato-avatar-fallback"
      >
        {{ iniciais() }}
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        vertical-align: middle;
        flex-shrink: 0;
      }

      .candidato-avatar-img {
        object-position: top center;
        aspect-ratio: 1 / 1;
        background-color: #f1f5f9;
      }

      .candidato-avatar-fallback {
        aspect-ratio: 1 / 1;
        letter-spacing: -0.05em;
      }

      .candidato-avatar-nao-eleito {
        filter: grayscale(100%) contrast(1.15);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidatoAvatarComponent {
  readonly foto = input<FotoCandidato | null | undefined>(null);
  readonly nome = input<string>('');
  readonly partido = input<string>('');
  readonly tamanho = input<32 | 36 | 48 | 64 | 96 | number>(36);
  readonly comBorda = input<boolean>(true);
  readonly naoEleito = input<boolean>(false);

  readonly erroImagem = signal<boolean>(false);

  readonly temFotoValida = computed(() => {
    const f = this.foto();
    return !!f && typeof f.arquivo === 'string' && f.arquivo.trim().length > 0;
  });

  readonly caminhoFoto = computed(() => {
    const f = this.foto();
    if (!f || !f.arquivo) return '';
    const arq = f.arquivo.trim();
    return arq.startsWith('data/') ? arq : `data/${arq}`;
  });

  readonly tamanhoFonte = computed(() => {
    const t = this.tamanho();
    if (t >= 96) return 28;
    if (t >= 64) return 20;
    if (t >= 48) return 15;
    if (t >= 36) return 12;
    return 11;
  });

  readonly iniciais = computed(() => {
    const n = (this.nome() || '').trim();
    if (!n) return '??';

    const tokens = n
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .filter((t) => !TITULOS_IGNORADOS.has(t.toUpperCase()));

    if (tokens.length === 0) {
      const fallbackTokens = n.split(/\s+/).filter((t) => t.length > 0);
      if (fallbackTokens.length === 0) return '??';
      return fallbackTokens[0].slice(0, 2).toUpperCase();
    }

    if (tokens.length === 1) {
      const t = tokens[0];
      return t.length >= 2 ? t.slice(0, 2).toUpperCase() : t.toUpperCase();
    }

    const primeiro = tokens[0][0];
    const ultimo = tokens[tokens.length - 1][0];
    return `${primeiro}${ultimo}`.toUpperCase();
  });

  aoOcorrerErro(): void {
    this.erroImagem.set(true);
  }
}
