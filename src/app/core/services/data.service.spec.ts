import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { IndiceCidades, MunicipioSnapshot } from '../models/contrato.model';

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
      schema_version: '0.3.0',
      gerado_em: '2026-10-29T16:17:22-0400',
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

  it('should fetch indice cidades with caching (shareReplay)', () => {
    const mockIndice: IndiceCidades = {
      schema_version: '0.3.0',
      gerado_em: '2026-10-29T16:17:22-0400',
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
});
