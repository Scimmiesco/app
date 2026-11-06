import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MunicipioItemDestaque, SecaoEnvelope } from '../../../core/models/contrato.model';
import { MunicipiosEstadoComponent } from './municipios-estado.component';

const secao: SecaoEnvelope<MunicipioItemDestaque[]> = {
  titulo: 'Municípios em Destaque — MS',
  categoria: 'MUNICÍPIOS',
  status: 'oficial',
  fonte: 'ibge_censo_2022',
  ano: 2022,
  coletado_em: '2026-11-05',
  motivo: null,
  dados: [
    {
      codigo_ibge: 5002704,
      nome: 'Campo Grande',
      populacao: 898100,
      disponivel: true,
    },
  ],
};

describe('MunicipiosEstadoComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should render municipal cards and link to city', () => {
    const fixture = TestBed.createComponent(MunicipiosEstadoComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.componentRef.setInput('siglaUf', 'MS');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.textContent).toContain('Campo Grande / MS');
    expect(el.textContent).toContain('898.100');

    const link = el.querySelector('[data-testid="link-municipio-5002704"]');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/cidade/5002704');
  });
});
