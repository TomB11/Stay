import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RewardsOverview } from '../../rewards/models/rewards.interface';
import { DashboardComponent } from './dashboard.component';

const overview: RewardsOverview = {
  actions: 6,
  actionsToday: { sessions: 1, diaryEntries: 0, exposureAttempts: 0 },
  totals: { sessions: 0, diaryEntries: 0, exposureAttempts: 0 },
  ladder: { attempts: 1, masteredSteps: 0, highestMasteredAnxiety: 0 },
  giftsEarned: 1,
  giftsAvailable: 1,
  actionsToNextGift: 4,
  actionsPerGift: 5,
  rewards: [],
};

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.match((req) => req.url.includes('/rewards')).forEach((r) => r.flush(overview));
  });

  it('shows the tree and the mission tab after loading', () => {
    http.expectOne((req) => req.url.includes('/rewards')).flush(overview);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-courage-tree')).toBeTruthy();
    expect(el.querySelector('app-daily-mission')).toBeTruthy();
    expect(el.querySelectorAll('.tab').length).toBe(3);
    expect(el.querySelector('.dot')).toBeTruthy();
  });

  it('switches to the ladder tab', () => {
    http.expectOne((req) => req.url.includes('/rewards')).flush(overview);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('.tab') as NodeListOf<HTMLButtonElement>;
    tabs[2].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-ladder-badges')).toBeTruthy();
  });

  it('shows an error when loading fails', () => {
    http
      .expectOne((req) => req.url.includes('/rewards'))
      .flush('x', { status: 500, statusText: 'err' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error')).toBeTruthy();
  });
});
