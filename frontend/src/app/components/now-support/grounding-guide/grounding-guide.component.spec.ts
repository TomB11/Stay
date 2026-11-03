import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroundingGuideComponent } from './grounding-guide.component';

describe('GroundingGuideComponent', () => {
  let fixture: ComponentFixture<GroundingGuideComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroundingGuideComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(GroundingGuideComponent);
    fixture.detectChanges();
  });

  it('walks from 5 down to 1 and then finishes', () => {
    let finished = 0;
    fixture.componentInstance.finished.subscribe(() => finished++);
    const root: HTMLElement = fixture.nativeElement;
    const next = root.querySelector('button') as HTMLButtonElement;

    expect(root.querySelector('.count')?.textContent).toBe('5');
    for (let expected = 4; expected >= 1; expected--) {
      next.click();
      fixture.detectChanges();
      expect(root.querySelector('.count')?.textContent).toBe(String(expected));
    }
    expect(finished).toBe(0);
    next.click();
    expect(finished).toBe(1);
  });
});
