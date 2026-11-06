import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DataService } from './data.service';
import {
  EstadoSnapshot,
  IndiceCidades,
  IndiceEstados,
  MunicipioSnapshot,
} from '../models/contrato.model';

describe('DataService', () => {
  let service: DataService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), DataService],
    });

    service = TestBed.inject(DataService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cidade snapshot with caching (shareReplay)', () => {
    const mockSnapshot = {
      schema_version: '0.5.0',
      gerado_em: '2026-10-31T20:45:00-0400',
      municipio: {
        codigo_ibge: 5002704,
        codigo_tse: '90514',
        nome: 'Campo Grande',
        uf: 'MS',
      },
      fontes: {},
      secoes: {},
      pendencias: [],
    } as unknown as MunicipioSnapshot;

    let result1: MunicipioSnapshot | undefined;
    let result2: MunicipioSnapshot | undefined;

    service.getCidade(5002704).subscribe((data) => (result1 = data));
    service.getCidade('5002704').subscribe((data) => (result2 = data));

    const req = httpTesting.expectOne('/data/municipios/5002704.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockSnapshot);

    expect(result1).toEqual(mockSnapshot);
    expect(result2).toEqual(mockSnapshot);
    httpTesting.expectNone('/data/municipios/5002704.json');
  });

  it('should not cache errors and allow subsequent retry requests', () => {
    let errorReceived = false;
    service.getCidade(5002704).subscribe({
      next: () => undefined,
      error: () => (errorReceived = true),
    });

    const req1 = httpTesting.expectOne('/data/municipios/5002704.json');
    req1.flush('Erro 500', { status: 500, statusText: 'Server Error' });
    expect(errorReceived).toBe(true);

    // Próxima chamada deve disparar nova requisição HTTP (cache limpo)
    let retrySuccess = false;
    service.getCidade(5002704).subscribe({
      next: () => (retrySuccess = true),
    });

    const req2 = httpTesting.expectOne('/data/municipios/5002704.json');
    req2.flush({
      schema_version: '0.4.0',
      municipio: { codigo_ibge: 5002704 },
    });
    expect(retrySuccess).toBe(true);
  });

  it('should fetch indice cidades with caching (shareReplay)', () => {
    const mockIndice: IndiceCidades = {
      schema_version: '0.5.0',
      gerado_em: '2026-10-31T20:45:00-0400',
      cidades: [
        {
          codigo_ibge: 5002704,
          codigo_tse: '90514',
          nome: 'Campo Grande',
          uf: 'MS',
          arquivo: 'municipios/5002704.json',
          disponivel: true,
        },
      ],
    };

    let result: IndiceCidades | undefined;
    service.getIndiceCidades().subscribe((data) => (result = data));

    const req = httpTesting.expectOne('/data/indice-cidades.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockIndice);

    expect(result).toEqual(mockIndice);
  });

  it('should fetch estado snapshot with caching', () => {
    const mockEstado = {
      schema_version: '0.12.0',
      gerado_em: '2026-11-05T20:00:00-0400',
      estado: {
        codigo_uf: 50,
        sigla: 'MS',
        nome: 'Mato Grosso do Sul',
        regiao: 'Centro-Oeste',
        capital: { nome: 'Campo Grande', codigo_ibge: 5002704 },
        total_municipios: 79,
      },
      fontes: {},
      secoes: {},
      pendencias: [],
    } as unknown as EstadoSnapshot;

    let res1: EstadoSnapshot | undefined;
    let res2: EstadoSnapshot | undefined;

    service.getEstado('MS').subscribe((data) => (res1 = data));
    service.getEstado('ms').subscribe((data) => (res2 = data));

    const req = httpTesting.expectOne('/data/estados/MS.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEstado);

    expect(res1).toEqual(mockEstado);
    expect(res2).toEqual(mockEstado);
  });

  it('should fetch indice estados with caching', () => {
    const mockIndiceEstados: IndiceEstados = {
      schema_version: '0.12.0',
      gerado_em: '2026-11-05T20:00:00-0400',
      estados: [
        {
          sigla: 'MS',
          codigo_uf: 50,
          nome: 'Mato Grosso do Sul',
          regiao: 'Centro-Oeste',
          arquivo: 'estados/MS.json',
          disponivel: true,
        },
      ],
    };

    let result: IndiceEstados | undefined;
    service.getIndiceEstados().subscribe((data) => (result = data));

    const req = httpTesting.expectOne('/data/indice-estados.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockIndiceEstados);

    expect(result).toEqual(mockIndiceEstados);
  });

  it('should track and retrieve last accessed municipality', () => {
    expect(service.getUltimoMunicipio()).toBe('5002704');

    service.registrarMunicipioAcessado('5003702', 'MS');
    expect(service.getUltimoMunicipio()).toBe('5003702');
    expect(service.getUltimoMunicipio('MS')).toBe('5003702');
    expect(service.getUltimoMunicipio('PR')).toBe('5003702');

    service.registrarMunicipioAcessado('4106902', 'PR');
    expect(service.getUltimoMunicipio()).toBe('4106902');
    expect(service.getUltimoMunicipio('MS')).toBe('5003702');
    expect(service.getUltimoMunicipio('PR')).toBe('4106902');
  });
});
