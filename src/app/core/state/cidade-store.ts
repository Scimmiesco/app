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
import { CidadeItemIndice, IndiceCidades, MunicipioSnapshot } from '../models/contrato.model';
import { DataService } from '../services/data.service';

const CIDADE_PADRAO: CidadeItemIndice = {
  codigo_ibge: 5002704,
  codigo_tse: '90514',
  nome: 'Campo Grande',
  uf: 'MS',
  arquivo: 'municipios/5002704.json',
  disponivel: true,
};

const MENSAGEM_ERRO =
  'Não foi possível carregar os dados oficiais deste município. Verifique se o arquivo está disponível ou tente novamente.';

@Injectable({ providedIn: 'root' })
export class CidadeStore {
  private readonly dataService = inject(DataService);
  private readonly destroyRef = inject(DestroyRef);

  readonly snapshot = signal<MunicipioSnapshot | null>(null);
  readonly carregando = signal<boolean>(true);
  readonly erro = signal<string | null>(null);
  readonly indice = signal<IndiceCidades | null>(null);
  readonly cidades = computed<CidadeItemIndice[]>(() => this.indice()?.cidades ?? [CIDADE_PADRAO]);

  private readonly codigo$ = new BehaviorSubject<string>('5002704');
  private readonly recarga$ = new Subject<void>();

  constructor() {
    combineLatest([this.codigo$, this.recarga$.pipe(startWith(undefined))])
      .pipe(
        tap(() => {
          this.carregando.set(true);
          this.erro.set(null);
        }),
        switchMap(([codigo]) =>
          this.dataService.getCidade(codigo || '5002704').pipe(
            tap(() => this.carregando.set(false)),
            catchError((err) => {
              console.error('Erro ao carregar dados do município:', err);
              this.carregando.set(false);
              this.erro.set(MENSAGEM_ERRO);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((snap) => this.snapshot.set(snap));

    this.dataService
      .getIndiceCidades()
      .pipe(
        catchError(() => of(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((indice) => this.indice.set(indice));
  }

  carregar(codigo: string): void {
    const alvo = codigo || '5002704';
    if (this.codigo$.value !== alvo) {
      this.codigo$.next(alvo);
    }
  }

  recarregar(): void {
    this.dataService.limparCacheCidade(this.codigo$.value);
    this.recarga$.next();
  }
}
