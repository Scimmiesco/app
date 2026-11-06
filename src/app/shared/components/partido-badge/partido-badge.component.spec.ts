import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { PartidoBadgeComponent } from './partido-badge.component';

@Component({
  standalone: true,
  imports: [PartidoBadgeComponent],
  template: `<app-partido-badge [sigla]="sigla()" />`,
})
class TestHostComponent {
  readonly sigla = signal<string>('PT');
}

describe('PartidoBadgeComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, PartidoBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render PT badge with full name in title and aria-label', () => {
    host.sigla.set('PT');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector(
      '[data-testid="badge-partido"]',
    ) as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.textContent?.trim()).toBe('PT');
    expect(badge.getAttribute('data-partido')).toBe('PT');
    expect(badge.getAttribute('title')).toBe('Partido dos Trabalhadores (PT)');
    expect(badge.getAttribute('aria-label')).toBe('Partido dos Trabalhadores (PT)');
  });

  it('should render PSB badge correctly', () => {
    host.sigla.set('PSB');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector(
      '[data-testid="badge-partido"]',
    ) as HTMLElement;
    expect(badge.textContent?.trim()).toBe('PSB');
    expect(badge.getAttribute('data-partido')).toBe('PSB');
    expect(badge.getAttribute('title')).toBe('Partido Socialista Brasileiro (PSB)');
  });

  it('should render UNIÃO badge supporting both accented and unaccented input', () => {
    host.sigla.set('UNIÃO');
    fixture.detectChanges();

    let badge = fixture.nativeElement.querySelector('[data-testid="badge-partido"]') as HTMLElement;
    expect(badge.getAttribute('data-partido')).toBe('UNIÃO');
    expect(badge.getAttribute('title')).toBe('União Brasil (UNIÃO)');

    host.sigla.set('UNIAO');
    fixture.detectChanges();

    badge = fixture.nativeElement.querySelector('[data-testid="badge-partido"]') as HTMLElement;
    expect(badge.getAttribute('data-partido')).toBe('UNIAO');
    expect(badge.getAttribute('title')).toBe('União Brasil (UNIAO)');
  });

  it('should render MDB and PV with distinct attributes and titles', () => {
    host.sigla.set('MDB');
    fixture.detectChanges();

    let badge = fixture.nativeElement.querySelector('[data-testid="badge-partido"]') as HTMLElement;
    expect(badge.getAttribute('data-partido')).toBe('MDB');
    expect(badge.getAttribute('title')).toBe('Movimento Democrático Brasileiro (MDB)');

    host.sigla.set('PV');
    fixture.detectChanges();

    badge = fixture.nativeElement.querySelector('[data-testid="badge-partido"]') as HTMLElement;
    expect(badge.getAttribute('data-partido')).toBe('PV');
    expect(badge.getAttribute('title')).toBe('Partido Verde (PV)');
  });

  it('should render unknown party with fallback label and title', () => {
    host.sigla.set('XYZ');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector(
      '[data-testid="badge-partido"]',
    ) as HTMLElement;
    expect(badge.textContent?.trim()).toBe('XYZ');
    expect(badge.getAttribute('data-partido')).toBe('XYZ');
    expect(badge.getAttribute('title')).toBe('Partido XYZ');
    expect(badge.getAttribute('aria-label')).toBe('Partido XYZ');
  });
});
