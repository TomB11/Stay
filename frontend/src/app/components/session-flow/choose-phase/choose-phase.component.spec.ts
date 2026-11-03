import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChoosePhaseComponent } from './choose-phase.component';

describe('ChoosePhaseComponent', () => {
  let fixture: ComponentFixture<ChoosePhaseComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePhaseComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ChoosePhaseComponent);
  });
  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
  it('links the SOS button straight to the now screen', () => {
    fixture.detectChanges();
    const sos = fixture.nativeElement.querySelector('a.sos');
    expect(sos.getAttribute('href')).toBe('/now');
  });
});
