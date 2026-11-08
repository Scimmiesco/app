import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.removeItem('color-scheme');
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.removeItem('color-scheme');
    document.documentElement.removeAttribute('data-theme');
  });

  it('should initialize following system default and update meta and data-theme on definirTema', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.esquemaAtivo()).toBeDefined();

    service.definirTema('dark');
    expect(service.temaEscuro()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    expect(meta).toBeTruthy();

    service.definirTema('light');
    expect(service.temaEscuro()).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should toggle between light and dark via alternarTema', () => {
    const service = TestBed.inject(ThemeService);
    service.definirTema('light');
    expect(service.temaEscuro()).toBe(false);

    service.alternarTema();
    expect(service.temaEscuro()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    service.alternarTema();
    expect(service.temaEscuro()).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
