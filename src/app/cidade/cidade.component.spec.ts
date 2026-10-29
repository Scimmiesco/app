import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CidadeComponent } from './cidade.component';

describe('CidadeComponent', () => {
  let component: CidadeComponent;
  let fixture: ComponentFixture<CidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CidadeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render municipal title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Painel Municipal: Campo Grande / MS',
    );
  });

  it('should display default IBGE code', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('5002704');
  });
});
