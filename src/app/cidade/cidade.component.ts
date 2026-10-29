import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DataService } from '../core/services/data.service';
import { FonteMeta, ParlamentarItem } from '../core/models/contrato.model';

@Component({
  selector: 'app-cidade',
  imports: [CommonModule],
  templateUrl: './cidade.component.html',
  styleUrl: './cidade.component.css',
})
export class CidadeComponent {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  readonly codigoIbge = input<string>('5002704');

  private readonly codigoIbge$ = toObservable(this.codigoIbge);

  readonly snapshot = toSignal(
    this.codigoIbge$.pipe(
      switchMap((codigo) =>
        this.dataService.getCidade(codigo || '5002704').pipe(
          catchError((err) => {
            console.error('Erro ao carregar dados do município:', err);
            return of(null);
          }),
        ),
      ),
    ),
    { initialValue: null },
  );

  readonly indice = toSignal(this.dataService.getIndiceCidades().pipe(catchError(() => of(null))), {
    initialValue: null,
  });

  readonly cidades = computed(() => {
    return (
      this.indice()?.cidades ?? [
        {
          codigo_ibge: 5002704,
          nome: 'Campo Grande',
          uf: 'MS',
          arquivo: 'municipios/5002704.json',
          disponivel: true,
        },
      ]
    );
  });

  readonly deputadosOrdenados = computed<ParlamentarItem[]>(() => {
    const secao = this.snapshot()?.secoes?.deputados_federais;
    const deps = secao?.dados;
    if (!deps || !Array.isArray(deps)) {
      return [];
    }

    return [...deps].sort((a, b) => {
      if (a.em_exercicio && !b.em_exercicio) return -1;
      if (!a.em_exercicio && b.em_exercicio) return 1;
      return (b.votos ?? 0) - (a.votos ?? 0);
    });
  });

  getFonte(chaveFonte?: string): FonteMeta | undefined {
    if (!chaveFonte) return undefined;
    return this.snapshot()?.fontes?.[chaveFonte];
  }

  onCidadeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const novoCodigo = selectElement.value;
    if (novoCodigo) {
      this.router.navigate(['/cidade', novoCodigo]);
    }
  }

  formatarNumero(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    return new Intl.NumberFormat('pt-BR').format(val);
  }

  formatarMoeda(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  }

  formatarPct(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    return (
      new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val) + '%'
    );
  }

  formatarDataIso(isoStr?: string | null): string {
    if (!isoStr) return '—';
    const partes = isoStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return isoStr;
  }
}
