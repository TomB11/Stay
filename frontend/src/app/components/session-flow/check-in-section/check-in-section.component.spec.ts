import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckInSectionComponent } from './check-in-section.component';

describe('CheckInSectionComponent', () => {
  let fixture: ComponentFixture<CheckInSectionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInSectionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckInSectionComponent);
  });
  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
