import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cidade/5002704',
  },
  {
    path: 'cidade/:codigoIbge',
    loadComponent: () => import('./cidade/cidade.component').then((m) => m.CidadeComponent),
  },
  {
    path: 'estado/:uf',
    loadComponent: () => import('./estado/estado.component').then((m) => m.EstadoComponent),
  },
  {
    path: '**',
    redirectTo: 'cidade/5002704',
  },
];
