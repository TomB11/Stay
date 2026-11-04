import { ComponentFixture, TestBed } from '@angular/core/testing';
import { badgeLevelFor, LADDER_BADGES } from '../../rewards/constants/ladder-badges.constant';
import { LadderBadgesComponent } from './ladder-badges.component';

describe('LadderBadgesComponent', () => {
  let fixture: ComponentFixture<LadderBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LadderBadgesComponent] }).compileComponents();
    fixture = TestBed.createComponent(LadderBadgesComponent);
  });

  it('levels a badge up as its value grows', () => {
    const courage = LADDER_BADGES[0];
    expect(badgeLevelFor(courage, { attempts: 0, masteredSteps: 0, highestMasteredAnxiety: 0, actions: 0, sessions: 0, diaryEntries: 0 }).level).toBe(0);
    expect(badgeLevelFor(courage, { attempts: 5, masteredSteps: 0, highestMasteredAnxiety: 0, actions: 0, sessions: 0, diaryEntries: 0 })).toEqual({
      level: 2,
      value: 5,
      next: 15,
    });
    expect(badgeLevelFor(courage, { attempts: 99, masteredSteps: 0, highestMasteredAnxiety: 0, actions: 0, sessions: 0, diaryEntries: 0 }).next).toBeNull();
  });

  it('shows locked medals and upgraded tiers', () => {
    fixture.componentRef.setInput('ladder', { attempts: 15, masteredSteps: 0, highestMasteredAnxiety: 0, actions: 0, sessions: 0, diaryEntries: 0 });
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.badge') as NodeListOf<HTMLElement>;
    expect(items.length).toBe(6);
    expect(items[0].classList).toContain('tier-3');
    expect(items[1].classList).toContain('tier-0');
    expect(fixture.nativeElement.querySelectorAll('.focus').length).toBe(1);
  });
});