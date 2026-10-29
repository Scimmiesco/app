import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CidadeComponent } from './cidade.component';

describe('CidadeComponent', () => {
  let component: CidadeComponent;
  let fixture: ComponentFixture<CidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CidadeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render municipal title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Campo Grande / MS');
  });

  it('should render city selector with Campo Grande option', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('#cidade-select') as HTMLSelectElement;
    expect(select).toBeTruthy();
    expect(select.options.length).toBe(1);
    expect(select.options[0].textContent).toContain('Campo Grande - MS');
  });

  it('should display default IBGE code or placeholder', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('5002704');
  });
});
