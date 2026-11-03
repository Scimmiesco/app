import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FonteMeta } from '../core/models/contrato.model';
import { CidadeStore } from '../core/state/cidade-store';
import { CabecalhoCidadeComponent } from './components/cabecalho-cidade/cabecalho-cidade.component';
import { ComoCalculamosComponent } from './components/como-calculamos/como-calculamos.component';
import { DeputadosEstaduaisComponent } from './components/deputados-estaduais/deputados-estaduais.component';
import { DeputadosFederaisComponent } from './components/deputados-federais/deputados-federais.component';
import { EleicaoPresidencialComponent } from './components/eleicao-presidencial/eleicao-presidencial.component';
import { GovernadorComponent } from './components/governador/governador.component';
import { PrefeitoComponent } from './components/prefeito/prefeito.component';
import { ResumoEconomiaComponent } from './components/resumo-economia/resumo-economia.component';
import { ResumoEducacaoComponent } from './components/resumo-educacao/resumo-educacao.component';
import { ResumoEscolarizacaoComponent } from './components/resumo-escolarizacao/resumo-escolarizacao.component';
import { ResumoFinancasComponent } from './components/resumo-financas/resumo-financas.component';
import { ResumoIbgeComponent } from './components/resumo-ibge/resumo-ibge.component';
import { ResumoPopulacaoEstimadaComponent } from './components/resumo-populacao-estimada/resumo-populacao-estimada.component';
import { SenadoresComponent } from './components/senadores/senadores.component';
import { VereadoresComponent } from './components/vereadores/vereadores.component';

@Component({
  selector: 'app-cidade',
  providers: [CidadeStore],
  imports: [
    CommonModule,
    CabecalhoCidadeComponent,
    ResumoIbgeComponent,
    ResumoEconomiaComponent,
    ResumoPopulacaoEstimadaComponent,
    ResumoEscolarizacaoComponent,
    ResumoEducacaoComponent,
    ResumoFinancasComponent,
    EleicaoPresidencialComponent,
    GovernadorComponent,
    SenadoresComponent,
    DeputadosFederaisComponent,
    DeputadosEstaduaisComponent,
    PrefeitoComponent,
    VereadoresComponent,
    ComoCalculamosComponent,
  ],
  templateUrl: './cidade.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CidadeComponent {
  private readonly router = inject(Router);
  private readonly store = inject(CidadeStore);

  readonly codigoIbge = input<string>('5002704');

  readonly snapshot = this.store.snapshot;
  readonly carregando = this.store.carregando;
  readonly erroCarregamento = this.store.erro;
  readonly cidades = this.store.cidades;

  constructor() {
    effect(() => {
      this.store.carregar(this.codigoIbge());
    });
  }

  fonte(chaveFonte?: string): FonteMeta | undefined {
    if (!chaveFonte) return undefined;
    return this.snapshot()?.fontes?.[chaveFonte];
  }

  tentarNovamente(): void {
    this.store.recarregar();
  }

  navegarParaCidade(codigo: string): void {
    if (codigo) {
      void this.router.navigate(['/cidade', codigo]);
    }
  }
}
