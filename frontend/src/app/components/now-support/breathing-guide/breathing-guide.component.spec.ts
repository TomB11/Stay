import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BREATHING_DURATION_SECONDS } from '../../../now/constants/breathing.constant';
import { BreathingGuideComponent } from './breathing-guide.component';

describe('BreathingGuideComponent', () => {
  let fixture: ComponentFixture<BreathingGuideComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreathingGuideComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BreathingGuideComponent);
  });

  it('switches from inhale to exhale and finishes after the full duration', fakeAsync(() => {
    let finished = 0;
    fixture.componentInstance.finished.subscribe(() => finished++);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Breathe in');

    tick(4000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Breathe out');

    tick((BREATHING_DURATION_SECONDS - 4) * 1000);
    expect(finished).toBe(1);
    fixture.destroy();
  }));

  it('emits finished when the user is done early', () => {
    let finished = 0;
    fixture.componentInstance.finished.subscribe(() => finished++);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(finished).toBe(1);
  });
});
