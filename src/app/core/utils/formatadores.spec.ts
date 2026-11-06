import {
  formatarDataIso,
  formatarDesvio,
  formatarIndice,
  formatarMoeda,
  formatarNota,
  formatarNumero,
  formatarPct,
  formatarStatus,
  formatarVariacaoPct,
  formatarVariacaoVotos,
  getCorPartido,
  getNumero,
  getNumeroHistorico,
  getNumeroPrefixo,
  getNumeroResto,
} from './formatadores';

describe('formatadores', () => {
  it('should format numbers using pt-BR separators', () => {
    expect(formatarNumero(898100)).toBe('898.100');
    expect(formatarNumero(8082.978)).toBe('8.082,978');
    expect(formatarNumero(null)).toBe('—');
    expect(formatarNumero(undefined)).toBe('—');
  });

  it('should format currency with non-breaking space and two decimals', () => {
    const moeda = formatarMoeda(2450.5);
    expect(moeda).toContain('R$');
    expect(moeda).toContain('2.450,50');
    expect(moeda.includes(' ')).toBe(false);
    expect(moeda.includes('\u00A0')).toBe(true);
    expect(formatarMoeda(null)).toBe('—');
  });

  it('should format percentages and variations', () => {
    expect(formatarPct(58.67)).toBe('58,67%');
    expect(formatarPct(100)).toBe('100,00%');
    expect(formatarIndice(0.81)).toBe('0,81');
    expect(formatarIndice(0.05)).toBe('0,05');
    expect(formatarIndice(0.5)).toBe('0,50');
    expect(formatarIndice(null)).toBe('—');
    expect(formatarIndice(undefined)).toBe('—');
    expect(formatarNota(8.1)).toBe('8,1');
    expect(formatarNota(5)).toBe('5,0');
    expect(formatarNota(3)).toBe('3,0');
    expect(formatarNota(0.5)).toBe('0,5');
    expect(formatarNota(10)).toBe('10,0');
    expect(formatarNota(null)).toBe('—');
    expect(formatarNota(undefined)).toBe('—');
    expect(formatarDesvio(0.7)).toBe('+0,7');
    expect(formatarDesvio(1.1)).toBe('+1,1');
    expect(formatarDesvio(-1.3)).toBe('-1,3');
    expect(formatarDesvio(-0.5)).toBe('-0,5');
    expect(formatarDesvio(0.0)).toBe('0,0');
    expect(formatarDesvio(0)).toBe('0,0');
    expect(formatarDesvio(-0)).toBe('0,0');
    expect(formatarDesvio(null)).toBe('—');
    expect(formatarDesvio(undefined)).toBe('—');
    expect(formatarVariacaoVotos(23195)).toBe('+23.195');
    expect(formatarVariacaoVotos(-1)).toBe('-1');
    expect(formatarVariacaoPct(2.33)).toBe('+2,33 p.p.');
    expect(formatarVariacaoPct(-1.5)).toBe('-1,50 p.p.');
  });

  it('should format ISO dates without timezone drift', () => {
    expect(formatarDataIso('2031-01-31')).toBe('31/01/2031');
    expect(formatarDataIso(null)).toBe('—');
    expect(formatarDataIso('2030-12-31')).toBe('31/12/2030');
  });

  it('should translate raw election status values', () => {
    expect(formatarStatus('em_exercicio')).toBe('em exercício');
    expect(formatarStatus('nao_reeleito')).toBe('não reeleito');
    expect(formatarStatus('nao_concorreu_ao_cargo')).toBe('não concorreu ao cargo');
    expect(formatarStatus('reeleito')).toBe('reeleito');
    expect(formatarStatus('eleito')).toBe('eleito');
    expect(formatarStatus(null)).toBe('—');
  });

  it('should resolve candidate numbers strictly and split party prefix', () => {
    expect(getNumero({ numero: '1367' })).toBe('1367');
    expect(getNumero({ numero: null })).toBeNull();
    expect(getNumero({ numero: '   ' })).toBeNull();
    expect(
      getNumeroHistorico({
        numero_historico: { numero: '1331', ano: 2022, cargo: 'DEPUTADO FEDERAL', fonte: 'tse' },
      })?.numero,
    ).toBe('1331');
    expect(getNumeroHistorico({ numero_historico: null })).toBeNull();
    expect(getNumeroPrefixo('1367')).toBe('13');
    expect(getNumeroResto('1367')).toBe('67');
    expect(getNumeroPrefixo(null)).toBe('');
    expect(getNumeroResto(null)).toBe('');
  });

  it('should resolve official party colors', () => {
    expect(getCorPartido('PT')).toBe('#a0001c');
    expect(getCorPartido('pl')).toBe('#003da5');
    expect(getCorPartido(null)).toBe('#000000');
    expect(getCorPartido('DESCONHECIDO')).toBe('#000000');
  });
});
