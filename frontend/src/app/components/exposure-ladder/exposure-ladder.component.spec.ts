import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../core/api.constant';
import { ExposureStep } from '../../exposure/models/exposure-step.interface';
import { ExposureLadderComponent } from './exposure-ladder.component';

const step = (id: string, expectedAnxiety: number, afters: number[]): ExposureStep => ({
  id,
  title: `Step ${id}`,
  expectedAnxiety,
  createdAt: '2026-01-01T00:00:00.000Z',
  attempts: afters.map((anxietyAfter, index) => ({
    id: `${id}-${index}`,
    anxietyBefore: 8,
    anxietyAfter,
    createdAt: '2026-01-01T00:00:00.000Z',
  })),
});

describe('ExposureLadderComponent', () => {
  let fixture: ComponentFixture<ExposureLadderComponent>;
  let http: HttpTestingController;
  const root = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExposureLadderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ExposureLadderComponent);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  const flushSteps = (steps: ExposureStep[]) => {
    http.expectOne(`${API_BASE_URL}/exposure`).flush(steps);
    fixture.detectChanges();
  };

  it('shows the safety note and the empty state', () => {
    flushSteps([]);
    expect(root().querySelector('.safety-note')).toBeTruthy();
    expect(root().querySelector('.empty')).toBeTruthy();
  });

  it('highlights the easiest unmastered step as next', () => {
    flushSteps([step('a', 2, [1]), step('b', 5, []), step('c', 8, [])]);
    const items = root().querySelectorAll('.step');
    expect(items.length).toBe(3);
    expect(items[0].classList).toContain('mastered');
    expect(items[1].classList).toContain('next');
    expect(items[2].classList).not.toContain('next');
  });

  it('offers starters on focus and appends the picked one to the title', async () => {
    flushSteps([]);
    const input = root().querySelector('#step-title') as HTMLInputElement;
    expect(input.placeholder).not.toBe('');
    expect(root().querySelector('app-prompt-starters')).toBeNull();

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    (root().querySelector('app-prompt-starters button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(input.value.length).toBeGreaterThan(0);
  });

  it('adds a step and reloads the ladder', () => {
    flushSteps([]);
    const input = root().querySelector('#step-title') as HTMLInputElement;
    input.value = 'Say hello';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (root().querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    const request = http.expectOne(`${API_BASE_URL}/exposure`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'Say hello', expectedAnxiety: 4 });
    request.flush(step('x', 4, []));
    flushSteps([step('x', 4, [])]);
    expect(root().querySelectorAll('.step').length).toBe(1);
  });

  it('records an attempt for a step', () => {
    flushSteps([step('a', 5, [])]);
    (root().querySelector('.step-actions .secondary') as HTMLButtonElement).click();
    fixture.detectChanges();
    (root().querySelector('.attempt-form .primary') as HTMLButtonElement).click();

    const request = http.expectOne(`${API_BASE_URL}/exposure/a/attempts`);
    expect(request.request.body).toEqual({ anxietyBefore: 5, anxietyAfter: 5 });
    request.flush({});
    flushSteps([step('a', 5, [2])]);
    expect(root().querySelector('.step')?.classList).toContain('mastered');
  });
});
