import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cidade',
  imports: [],
  templateUrl: './cidade.component.html',
  styleUrl: './cidade.component.css',
})
export class CidadeComponent {
  readonly codigoIbge = input<string>('5002704');
}
