import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrisisAlertComponent } from './crisis-alert.component';

describe('CrisisAlertComponent', () => {
  let fixture: ComponentFixture<CrisisAlertComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisisAlertComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CrisisAlertComponent);
    fixture.detectChanges();
  });

  it('is announced as an alert and offers a call link', () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('[role="alert"]')).toBeTruthy();
    expect(root.querySelector('a[href="tel:112"]')).toBeTruthy();
  });
});
