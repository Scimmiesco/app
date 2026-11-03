import { TestBed } from '@angular/core/testing';
import { ResumoEducacaoDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import { ResumoEducacaoComponent } from './resumo-educacao.component';

const secao: SecaoEnvelope<ResumoEducacaoDados> = {
  titulo: 'Educação',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'inep_ideb_2023',
  ano: 2023,
  coletado_em: '2026-10-26',
  motivo: null,
  dados: { anos_iniciais: { '2023': 5.8 }, anos_finais: { '2023': 5.1 } },
};

describe('ResumoEducacaoComponent', () => {
  it('should render IDEB for early and final years', () => {
    const fixture = TestBed.createComponent(ResumoEducacaoComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Anos Iniciais');
    expect(texto).toContain('5.8');
    expect(texto).toContain('Anos Finais');
    expect(texto).toContain('5.1');
  });
});
