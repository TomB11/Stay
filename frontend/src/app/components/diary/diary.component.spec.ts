import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../core/api.constant';
import { DiaryEntry } from '../../diary/models/diary-entry.interface';
import { DiaryComponent } from './diary.component';

const entry: DiaryEntry = {
  id: 'e1',
  situation: 'Meeting',
  thought: 'I will fail',
  emotion: 'Fear',
  intensityBefore: 8,
  alternativeThought: 'I prepared',
  intensityAfter: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('DiaryComponent', () => {
  let fixture: ComponentFixture<DiaryComponent>;
  let http: HttpTestingController;
  const root = () => fixture.nativeElement as HTMLElement;

  const type = (selector: string, value: string) => {
    const input = root().querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const flushEntries = (entries: DiaryEntry[]) => {
    http.expectOne(`${API_BASE_URL}/diary`).flush(entries);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DiaryComponent);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('shows the empty state and keeps save disabled until required fields are filled', () => {
    flushEntries([]);
    const save = root().querySelector('.primary') as HTMLButtonElement;
    expect(root().querySelector('.empty')).toBeTruthy();
    expect(save.disabled).toBe(true);
    type('#diary-situation', 'Meeting');
    type('#diary-thought', 'I will fail');
    type('#diary-emotion', 'Fear');
    expect(save.disabled).toBe(false);
  });

  it('saves an entry and reloads the list', () => {
    flushEntries([]);
    type('#diary-situation', 'Meeting');
    type('#diary-thought', 'I will fail');
    type('#diary-emotion', 'Fear');
    (root().querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    const request = http.expectOne(`${API_BASE_URL}/diary`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(
      jasmine.objectContaining({
        situation: 'Meeting',
        thought: 'I will fail',
        emotion: 'Fear',
        intensityBefore: 5,
        intensityAfter: 5,
      }),
    );
    request.flush(entry);
    flushEntries([entry]);
    expect(root().querySelectorAll('.entry').length).toBe(1);
  });

  it('shows the crisis alert when the text contains a crisis signal', () => {
    flushEntries([]);
    expect(root().querySelector('app-crisis-alert')).toBeNull();
    type('#diary-thought', 'nechcem už žiť');
    expect(root().querySelector('app-crisis-alert')).toBeTruthy();
  });

  it('offers starter phrases while a field is focused and adds the picked one', async () => {
    flushEntries([]);
    const textarea = root().querySelector('#diary-situation') as HTMLTextAreaElement;
    expect(root().querySelector('.starters')).toBeNull();
    textarea.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    const chip = root().querySelector('.starters .chip') as HTMLButtonElement;
    expect(chip).toBeTruthy();
    chip.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(textarea.value.length).toBeGreaterThan(0);
    expect(textarea.placeholder.length).toBeGreaterThan(0);
  });

  it('deletes an entry', () => {
    flushEntries([entry]);
    (root().querySelector('.link-danger') as HTMLButtonElement).click();
    const request = http.expectOne(`${API_BASE_URL}/diary/e1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    flushEntries([]);
    expect(root().querySelector('.empty')).toBeTruthy();
  });
});
