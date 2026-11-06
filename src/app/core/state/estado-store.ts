import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { EstadoItemIndice, EstadoSnapshot, IndiceEstados } from '../models/contrato.model';
import { DataService } from '../services/data.service';

export const ESTADOS_PADRAO: EstadoItemIndice[] = [
  {
    sigla: 'MS',
    codigo_uf: 50,
    nome: 'Mato Grosso do Sul',
    regiao: 'Centro-Oeste',
    arquivo: 'estados/MS.json',
    disponivel: true,
  },
  {
    sigla: 'PR',
    codigo_uf: 41,
    nome: 'Paraná',
    regiao: 'Sul',
    arquivo: 'estados/PR.json',
    disponivel: true,
  },
  {
    sigla: 'PI',
    codigo_uf: 22,
    nome: 'Piauí',
    regiao: 'Nordeste',
    arquivo: 'estados/PI.json',
    disponivel: true,
  },
];

const MENSAGEM_ERRO_ESTADO =
  'Não foi possível carregar os dados oficiais deste estado. Verifique se o arquivo está disponível ou tente novamente.';

@Injectable()
export class EstadoStore {
  private readonly dataService = inject(DataService);
  private readonly destroyRef = inject(DestroyRef);

  readonly snapshot = signal<EstadoSnapshot | null>(null);
  readonly carregando = signal<boolean>(true);
  readonly erro = signal<string | null>(null);
  readonly indice = signal<IndiceEstados | null>(null);
  readonly estados = computed<EstadoItemIndice[]>(() => this.indice()?.estados ?? ESTADOS_PADRAO);

  private readonly uf$ = new BehaviorSubject<string>('MS');
  private readonly recarga$ = new Subject<void>();

  constructor() {
    combineLatest([this.uf$, this.recarga$.pipe(startWith(undefined))])
      .pipe(
        switchMap(([uf]) => {
          const alvo = (uf || '').trim().toUpperCase() || 'MS';
          this.carregando.set(true);
          this.erro.set(null);
          return this.dataService.getEstado(alvo).pipe(
            tap(() => this.carregando.set(false)),
            catchError((err) => {
              console.error('Erro ao carregar dados do estado:', err);
              this.carregando.set(false);
              this.erro.set(MENSAGEM_ERRO_ESTADO);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((snap) => this.snapshot.set(snap));

    this.dataService
      .getIndiceEstados()
      .pipe(
        catchError(() => of(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((indice) => this.indice.set(indice));
  }

  carregar(uf: string): void {
    const alvo = (uf || '').trim().toUpperCase() || 'MS';
    if (this.uf$.value !== alvo) {
      this.uf$.next(alvo);
    }
  }

  recarregar(): void {
    const ufAtual = this.uf$.value || 'MS';
    this.dataService.limparCacheEstado(ufAtual);
    this.recarga$.next();
  }
}
