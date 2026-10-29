import { Routes } from '@angular/router';
import { CidadeComponent } from './cidade/cidade.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cidade/5002704',
  },
  {
    path: 'cidade/:codigoIbge',
    component: CidadeComponent,
  },
  {
    path: '**',
    redirectTo: 'cidade/5002704',
  },
];
