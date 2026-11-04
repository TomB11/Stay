import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../core/api.constant';
import { RewardsOverview } from '../../rewards/models/rewards.interface';
import { RewardsComponent } from './rewards.component';

const overview = (overrides: Partial<RewardsOverview> = {}): RewardsOverview => ({
  actions: 3,
  giftsEarned: 0,
  giftsAvailable: 0,
  actionsToNextGift: 2,
  actionsPerGift: 5,
  rewards: [],
  ...overrides,
});

describe('RewardsComponent', () => {
  let fixture: ComponentFixture<RewardsComponent>;
  let http: HttpTestingController;
  const root = () => fixture.nativeElement as HTMLElement;
  const flush = (data: RewardsOverview) => {
    http.expectOne(`${API_BASE_URL}/rewards`).flush(data);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RewardsComponent);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('shows progress to the next gift without an open button', () => {
    flush(overview());
    expect(root().querySelector('[role="progressbar"]')).toBeTruthy();
    expect(root().querySelector('.reveal')).toBeNull();
  });

  it('hides the contents of wrapped gifts', () => {
    flush(
      overview({ rewards: [{ id: 'r1', title: null, openedAt: null, redeemedAt: null }] }),
    );
    expect(root().querySelectorAll('.gift').length).toBe(1);
    expect(root().textContent).not.toContain('Coffee');
  });

  it('opens a gift and reveals the reward', () => {
    flush(
      overview({
        giftsEarned: 1,
        giftsAvailable: 1,
        rewards: [{ id: 'r1', title: null, openedAt: null, redeemedAt: null }],
      }),
    );
    (root().querySelector('.reveal .primary') as HTMLButtonElement).click();
    http.expectOne(`${API_BASE_URL}/rewards/open`).flush({ id: 'r1', title: 'Coffee' });
    flush(
      overview({
        rewards: [{ id: 'r1', title: 'Coffee', openedAt: 'now', redeemedAt: null }],
      }),
    );
    expect(root().querySelector('.reward-title')?.textContent).toContain('Coffee');
  });

  it('adds a reward', async () => {
    flush(overview());
    await fixture.whenStable();
    const input = root().querySelector('#reward-title') as HTMLInputElement;
    input.value = 'Cinema';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (root().querySelector('.add-form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    const request = http.expectOne({ method: 'POST', url: `${API_BASE_URL}/rewards` });
    expect(request.request.body).toEqual({ title: 'Cinema' });
    request.flush({ id: 'r2', title: null, openedAt: null, redeemedAt: null });
    flush(overview());
  });
});
