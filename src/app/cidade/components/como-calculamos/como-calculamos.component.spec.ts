import { TestBed } from '@angular/core/testing';
import { ComoCalculamosComponent } from './como-calculamos.component';

describe('ComoCalculamosComponent', () => {
  it('should render the methodology card with official sources', () => {
    const fixture = TestBed.createComponent(ComoCalculamosComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[data-testid="como-calculamos-kicker"]')?.textContent?.trim()).toBe(
      'METODOLOGIA',
    );
    expect(el.querySelector('[data-testid="titulo-como-calculamos"]')?.textContent?.trim()).toBe(
      'Como calculamos',
    );
    expect(el.querySelector('[data-testid="texto-como-calculamos"]')?.textContent).toContain(
      'IBGE',
    );
  });
});
