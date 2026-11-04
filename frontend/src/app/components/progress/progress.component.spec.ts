import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from '../../core/api.constant';
import { Insights } from '../../progress/models/insights.interface';
import { ProgressComponent } from './progress.component';

const insights = (overrides: Partial<Insights> = {}): Insights => ({
  totalRecords: 4,
  averageIntensity: { last7Days: 4, previous7Days: 6 },
  sessionReduction: { count: 4, average: 2.5 },
  reductionByPhase: [{ phase: 'now', count: 4, averageReduction: 2.5 }],
  diaryReduction: { count: 0, average: null },
  helpfulRate: 75,
  exposure: { totalSteps: 3, masteredSteps: 1 },
  streakDays: 2,
  suggestProfessionalHelp: null,
  ...overrides,
});

describe('ProgressComponent', () => {
  let fixture: ComponentFixture<ProgressComponent>;
  let http: HttpTestingController;
  const root = () => fixture.nativeElement as HTMLElement;
  const flush = (data: Insights) => {
    http.expectOne(`${API_BASE_URL}/insights`).flush(data);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProgressComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.match(`${API_BASE_URL}/rewards`);
    http.verify();
  });

  it('renders the summary cards', () => {
    flush(insights());
    expect(root().querySelectorAll('.card').length).toBe(6);
    expect(root().querySelector('.help-banner')).toBeNull();
    expect(root().textContent).toContain('75 %');
    expect(root().textContent).toContain('1 / 3');
  });

  it('shows the empty state without any records', () => {
    flush(
      insights({
        totalRecords: 0,
        exposure: { totalSteps: 0, masteredSteps: 0 },
        averageIntensity: { last7Days: null, previous7Days: null },
      }),
    );
    expect(root().querySelector('.empty')).toBeTruthy();
    expect(root().querySelector('.card')).toBeNull();
  });

  it('recommends professional help when the backend suggests it', () => {
    flush(insights({ suggestProfessionalHelp: 'high' }));
    expect(root().querySelector('.help-banner')).toBeTruthy();
  });

  it('shows an error when loading fails', () => {
    http.expectOne(`${API_BASE_URL}/insights`).flush(null, { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(root().querySelector('.error')).toBeTruthy();
  });
});
