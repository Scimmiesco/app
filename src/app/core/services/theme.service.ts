import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type EsquemaTema = 'light' | 'dark';

const STORAGE_KEY = 'color-scheme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly overrideArmazenado = signal<EsquemaTema | null>(null);
  private readonly preferenciaSistema = signal<EsquemaTema>('light');

  readonly esquemaAtivo = computed<EsquemaTema>(() => {
    return this.overrideArmazenado() ?? this.preferenciaSistema();
  });

  readonly temaEscuro = computed<boolean>(() => this.esquemaAtivo() === 'dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.inicializarNoNavegador();
    }
  }

  definirTema(alvo: EsquemaTema): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.overrideArmazenado.set(alvo);
      return;
    }

    const prefSistemaAtual = this.lerPreferenciaSistema();
    this.preferenciaSistema.set(prefSistemaAtual);

    if (alvo === prefSistemaAtual) {
      // Usuário reverteu para o padrão do sistema: remove o override sem fixar contra mudanças futuras
      this.removerStorage();
      this.overrideArmazenado.set(null);
      this.aplicarMetaEDom(null, alvo);
    } else {
      // Usuário escolheu o oposto do sistema: armazena literalmente
      this.salvarStorage(alvo);
      this.overrideArmazenado.set(alvo);
      this.aplicarMetaEDom(alvo, alvo);
    }
  }

  alternarTema(): void {
    const oposto: EsquemaTema = this.esquemaAtivo() === 'dark' ? 'light' : 'dark';
    this.definirTema(oposto);
  }

  private inicializarNoNavegador(): void {
    const prefSistema = this.lerPreferenciaSistema();
    const salvo = this.lerStorage();

    this.preferenciaSistema.set(prefSistema);
    this.overrideArmazenado.set(salvo);
    this.aplicarMetaEDom(salvo, salvo ?? prefSistema);

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const aoMudarSistema = (evento: MediaQueryListEvent) => {
        const novaPref: EsquemaTema = evento.matches ? 'dark' : 'light';
        this.preferenciaSistema.set(novaPref);
        // Nunca remover retroativamente o valor salvo quando o sistema mudar para coincidir com ele
        const overrideAtual = this.overrideArmazenado();
        this.aplicarMetaEDom(overrideAtual, overrideAtual ?? novaPref);
      };

      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', aoMudarSistema);
      }
    }

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', (evento: StorageEvent) => {
        if (evento.key === STORAGE_KEY || evento.key === null) {
          const novoOverride = this.lerStorage();
          this.overrideArmazenado.set(novoOverride);
          this.aplicarMetaEDom(novoOverride, novoOverride ?? this.preferenciaSistema());
        }
      });
    }
  }

  private lerPreferenciaSistema(): EsquemaTema {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private lerStorage(): EsquemaTema | null {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      if (val === 'light' || val === 'dark') {
        return val;
      }
    } catch {
      // Ignora bloqueio de localStorage
    }
    return null;
  }

  private salvarStorage(valor: EsquemaTema): void {
    try {
      localStorage.setItem(STORAGE_KEY, valor);
    } catch {
      // Ignora bloqueio de localStorage
    }
  }

  private removerStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignora bloqueio de localStorage
    }
  }

  private aplicarMetaEDom(override: EsquemaTema | null, resolvido: EsquemaTema): void {
    const doc = this.document;
    if (!doc) return;

    let meta = doc.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    if (!meta && doc.head) {
      meta = doc.createElement('meta');
      meta.name = 'color-scheme';
      doc.head.appendChild(meta);
    }
    if (meta) {
      meta.content = override ?? 'light dark';
    }

    if (doc.documentElement) {
      doc.documentElement.setAttribute('data-theme', resolvido);
    }
  }
}
