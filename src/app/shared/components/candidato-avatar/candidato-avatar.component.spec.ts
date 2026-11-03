import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatoAvatarComponent } from './candidato-avatar.component';
import { FotoCandidato } from '../../../core/models/contrato.model';

describe('CandidatoAvatarComponent', () => {
  let component: CandidatoAvatarComponent;
  let fixture: ComponentFixture<CandidatoAvatarComponent>;

  const mockFoto: FotoCandidato = {
    arquivo: 'fotos/camara_220546.jpg',
    fonte: 'Câmara dos Deputados',
    url: 'https://www.camara.leg.br/internet/deputado/bandep/220546.jpg',
    credito: 'Câmara dos Deputados',
    ano: 2026,
    sha256: 'a1b2c3d4',
    largura: 256,
    altura: 256,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatoAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatoAvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render fallback avatar with initials when foto is null', () => {
    fixture.componentRef.setInput('foto', null);
    fixture.componentRef.setInput('nome', 'Mara Caseiro');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('[data-testid="candidato-avatar-img"]');
    const fallback = compiled.querySelector('[data-testid="candidato-avatar-fallback"]');

    expect(img).toBeFalsy();
    expect(fallback).toBeTruthy();
    expect(fallback?.textContent?.trim()).toBe('MC');
  });

  it('should ignore titles when generating initials', () => {
    fixture.componentRef.setInput('foto', null);
    fixture.componentRef.setInput('nome', 'Capitão Contar');
    fixture.detectChanges();

    expect(component.iniciais()).toBe('CO');

    fixture.componentRef.setInput('nome', 'Dr. Lídio Lopes');
    fixture.detectChanges();
    expect(component.iniciais()).toBe('LL');
  });

  it('should render image with NgOptimizedImage when foto is present', () => {
    fixture.componentRef.setInput('foto', mockFoto);
    fixture.componentRef.setInput('nome', 'Camila Jara');
    fixture.componentRef.setInput('tamanho', 32);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('[data-testid="candidato-avatar-img"]') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('data/fotos/camara_220546.jpg');
    expect(img.getAttribute('width')).toBe('32');
    expect(img.getAttribute('height')).toBe('32');
  });

  it('should switch to fallback when image error occurs', () => {
    fixture.componentRef.setInput('foto', mockFoto);
    fixture.componentRef.setInput('nome', 'Vander Loubet');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    let img = compiled.querySelector('[data-testid="candidato-avatar-img"]') as HTMLImageElement;
    expect(img).toBeTruthy();

    component.aoOcorrerErro();
    fixture.detectChanges();

    img = compiled.querySelector('[data-testid="candidato-avatar-img"]') as HTMLImageElement;
    const fallback = compiled.querySelector('[data-testid="candidato-avatar-fallback"]');
    expect(img).toBeFalsy();
    expect(fallback).toBeTruthy();
    expect(fallback?.textContent?.trim()).toBe('VL');
  });

  it('should support different sizes (32, 36, 48, 64, 96)', () => {
    fixture.componentRef.setInput('foto', null);
    fixture.componentRef.setInput('nome', 'Nelsinho Trad');
    fixture.componentRef.setInput('tamanho', 36);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const fallback = compiled.querySelector(
      '[data-testid="candidato-avatar-fallback"]',
    ) as HTMLElement;
    expect(fallback.style.width).toBe('36px');
    expect(fallback.style.height).toBe('36px');
    expect(fallback.style.fontSize).toBe('12px');

    fixture.componentRef.setInput('tamanho', 48);
    fixture.detectChanges();
    expect(fallback.style.width).toBe('48px');
    expect(fallback.style.height).toBe('48px');

    fixture.componentRef.setInput('tamanho', 96);
    fixture.detectChanges();
    expect(fallback.style.width).toBe('96px');
    expect(fallback.style.height).toBe('96px');
    expect(fallback.style.fontSize).toBe('28px');
  });
});
