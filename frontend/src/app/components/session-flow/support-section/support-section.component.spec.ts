import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportSectionComponent } from './support-section.component';

describe('SupportSectionComponent', () => {
  let fixture: ComponentFixture<SupportSectionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportSectionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SupportSectionComponent);
  });
  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
