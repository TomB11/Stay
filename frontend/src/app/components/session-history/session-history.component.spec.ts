import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { SessionHistoryComponent } from './session-history.component';

describe('SessionHistoryComponent', () => {
  let fixture: ComponentFixture<SessionHistoryComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionHistoryComponent],
      providers: [provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionHistoryComponent);
  });
  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
