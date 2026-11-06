import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FonteMeta } from '../core/models/contrato.model';
import { EstadoStore } from '../core/state/estado-store';
import { CabecalhoEstadoComponent } from './components/cabecalho-estado/cabecalho-estado.component';
import { MunicipiosEstadoComponent } from './components/municipios-estado/municipios-estado.component';
import { GovernadorComponent } from '../cidade/components/governador/governador.component';
import { SenadoresComponent } from '../cidade/components/senadores/senadores.component';
import { DeputadosFederaisComponent } from '../cidade/components/deputados-federais/deputados-federais.component';
import { DeputadosEstaduaisComponent } from '../cidade/components/deputados-estaduais/deputados-estaduais.component';
import { ComoCalculamosComponent } from '../cidade/components/como-calculamos/como-calculamos.component';

@Component({
  selector: 'app-estado',
  providers: [EstadoStore],
  imports: [
    CommonModule,
    CabecalhoEstadoComponent,
    MunicipiosEstadoComponent,
    GovernadorComponent,
    SenadoresComponent,
    DeputadosFederaisComponent,
    DeputadosEstaduaisComponent,
    ComoCalculamosComponent,
  ],
  templateUrl: './estado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadoComponent {
  private readonly router = inject(Router);
  private readonly store = inject(EstadoStore);

  readonly uf = input<string>('MS');

  readonly snapshot = this.store.snapshot;
  readonly carregando = this.store.carregando;
  readonly erroCarregamento = this.store.erro;
  readonly estados = this.store.estados;

  constructor() {
    effect(() => {
      this.store.carregar(this.uf());
    });
  }

  fonte(chaveFonte?: string): FonteMeta | undefined {
    if (!chaveFonte) return undefined;
    return this.snapshot()?.fontes?.[chaveFonte];
  }

  tentarNovamente(): void {
    this.store.recarregar();
  }

  navegarParaEstado(uf: string): void {
    if (uf) {
      void this.router.navigate(['/estado', uf.toUpperCase()]);
    }
  }
}
