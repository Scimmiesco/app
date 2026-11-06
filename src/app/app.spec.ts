import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render skip link and footer sources', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('[data-testid="skip-link-conteudo-principal"]')?.textContent,
    ).toContain('Pular para o conteúdo principal');
    expect(compiled.querySelector('[data-testid="nav-link-cidades"]')?.textContent).toContain(
      'Cidades',
    );
    expect(compiled.querySelector('[data-testid="nav-link-estados"]')?.textContent).toContain(
      'Estados',
    );
    expect(compiled.querySelector('footer')?.textContent).toContain('Fontes Oficiais:');
    expect(compiled.querySelector('footer')?.textContent).toContain('TSE');
  });
});
