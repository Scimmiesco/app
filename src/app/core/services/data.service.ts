import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs';
import {
  EstadoSnapshot,
  IndiceCidades,
  IndiceEstados,
  MunicipioSnapshot,
} from '../models/contrato.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly cidadeCache = new Map<string, Observable<MunicipioSnapshot>>();
  private readonly estadoCache = new Map<string, Observable<EstadoSnapshot>>();
  private indiceCache$?: Observable<IndiceCidades>;
  private indiceEstadosCache$?: Observable<IndiceEstados>;
  private ultimoMunicipioCodigo = '5002704';
  private readonly ultimoMunicipioPorUf = new Map<string, string>();

  registrarMunicipioAcessado(codigoIbge: string | number, uf?: string): void {
    const key = String(codigoIbge).trim();
    if (key) {
      this.ultimoMunicipioCodigo = key;
      if (uf) {
        this.ultimoMunicipioPorUf.set(uf.toUpperCase().trim(), key);
      }
    }
  }

  getUltimoMunicipio(uf?: string): string {
    if (uf) {
      const porUf = this.ultimoMunicipioPorUf.get(uf.toUpperCase().trim());
      if (porUf) return porUf;
    }
    return this.ultimoMunicipioCodigo || '5002704';
  }

  getCidade(codigoIbge: string | number): Observable<MunicipioSnapshot> {
    const key = String(codigoIbge);
    const cached$ = this.cidadeCache.get(key);
    if (cached$) {
      return cached$;
    }

    const request$ = this.http.get<MunicipioSnapshot>(`/data/municipios/${key}.json`).pipe(
      tap((snap) => {
        if (snap?.municipio) {
          this.registrarMunicipioAcessado(snap.municipio.codigo_ibge, snap.municipio.uf);
        }
      }),
      catchError((err) => {
        this.cidadeCache.delete(key);
        return throwError(() => err);
      }),
      shareReplay(1),
    );

    this.cidadeCache.set(key, request$);
    return request$;
  }

  getIndiceCidades(): Observable<IndiceCidades> {
    if (!this.indiceCache$) {
      this.indiceCache$ = this.http.get<IndiceCidades>('/data/indice-cidades.json').pipe(
        catchError((err) => {
          this.indiceCache$ = undefined;
          return throwError(() => err);
        }),
        shareReplay(1),
      );
    }
    return this.indiceCache$;
  }

  limparCacheCidade(codigoIbge: string | number): void {
    this.cidadeCache.delete(String(codigoIbge));
  }

  getEstado(siglaUf: string): Observable<EstadoSnapshot> {
    const key = (siglaUf || '').trim().toUpperCase();
    const cached$ = this.estadoCache.get(key);
    if (cached$) {
      return cached$;
    }

    const request$ = this.http.get<EstadoSnapshot>(`/data/estados/${key}.json`).pipe(
      catchError((err) => {
        this.estadoCache.delete(key);
        return throwError(() => err);
      }),
      shareReplay(1),
    );

    this.estadoCache.set(key, request$);
    return request$;
  }

  getIndiceEstados(): Observable<IndiceEstados> {
    if (!this.indiceEstadosCache$) {
      this.indiceEstadosCache$ = this.http.get<IndiceEstados>('/data/indice-estados.json').pipe(
        catchError((err) => {
          this.indiceEstadosCache$ = undefined;
          return throwError(() => err);
        }),
        shareReplay(1),
      );
    }
    return this.indiceEstadosCache$;
  }

  limparCacheEstado(siglaUf: string): void {
    this.estadoCache.delete((siglaUf || '').trim().toUpperCase());
  }
}
