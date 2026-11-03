import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummarySectionComponent } from './summary-section.component';

describe('SummarySectionComponent', () => {
  let fixture: ComponentFixture<SummarySectionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummarySectionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SummarySectionComponent);
  });
  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
