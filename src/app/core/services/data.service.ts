import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { IndiceCidades, MunicipioSnapshot } from '../models/contrato.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly cidadeCache = new Map<string, Observable<MunicipioSnapshot>>();
  private indiceCache$?: Observable<IndiceCidades>;

  getCidade(codigoIbge: string | number): Observable<MunicipioSnapshot> {
    const key = String(codigoIbge);
    const cached$ = this.cidadeCache.get(key);
    if (cached$) {
      return cached$;
    }

    const request$ = this.http
      .get<MunicipioSnapshot>(`/data/municipios/${key}.json`)
      .pipe(shareReplay(1));

    this.cidadeCache.set(key, request$);
    return request$;
  }

  getIndiceCidades(): Observable<IndiceCidades> {
    if (!this.indiceCache$) {
      this.indiceCache$ = this.http
        .get<IndiceCidades>('/data/indice-cidades.json')
        .pipe(shareReplay(1));
    }
    return this.indiceCache$;
  }
}
