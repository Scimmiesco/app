import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface CidadeOpcao {
  codigo_ibge: string;
  nome: string;
  uf: string;
}

@Component({
  selector: 'app-cidade',
  imports: [],
  templateUrl: './cidade.component.html',
  styleUrl: './cidade.component.css',
})
export class CidadeComponent {
  private readonly router = inject(Router);

  readonly codigoIbge = input<string>('5002704');

  readonly cidades = signal<CidadeOpcao[]>([
    {
      codigo_ibge: '5002704',
      nome: 'Campo Grande',
      uf: 'MS',
    },
  ]);

  onCidadeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const novoCodigo = selectElement.value;
    if (novoCodigo) {
      this.router.navigate(['/cidade', novoCodigo]);
    }
  }
}
