import { TestBed } from '@angular/core/testing';
import { ResumoPopulacaoEstimadaDados, SecaoEnvelope } from '../../../core/models/contrato.model';
import { ResumoPopulacaoEstimadaComponent } from './resumo-populacao-estimada.component';

const secao: SecaoEnvelope<ResumoPopulacaoEstimadaDados> = {
  titulo: 'População estimada',
  categoria: 'A CIDADE',
  status: 'oficial',
  fonte: 'ibge_estimativas',
  ano: 2026,
  coletado_em: '2026-11-03T14:18:07-0400',
  motivo: null,
  dados: { populacao_estimada: 970843 },
};

describe('ResumoPopulacaoEstimadaComponent', () => {
  it('should render the official estimated population', () => {
    const fixture = TestBed.createComponent(ResumoPopulacaoEstimadaComponent);
    fixture.componentRef.setInput('secao', secao);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(
      el.querySelector('[data-testid="card-metrica-populacao-estimada"]')?.textContent,
    ).toContain('970.843 hab');
    expect(el.querySelector('.badge-oficial')).toBeTruthy();
  });
});
