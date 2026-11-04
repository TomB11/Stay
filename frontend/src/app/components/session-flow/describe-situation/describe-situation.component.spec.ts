import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescribeSituationComponent } from './describe-situation.component';

describe('DescribeSituationComponent', () => {
  let fixture: ComponentFixture<DescribeSituationComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescribeSituationComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DescribeSituationComponent);
  });
  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows starters on focus and appends the picked one', () => {
    fixture.componentRef.setInput('phase', 'before');
    fixture.detectChanges();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.placeholder).not.toBe('');
    expect(fixture.nativeElement.querySelector('app-prompt-starters')).toBeNull();

    textarea.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    const chip: HTMLButtonElement = fixture.nativeElement.querySelector('app-prompt-starters button');
    expect(chip).toBeTruthy();

    let emitted = '';
    (fixture.componentInstance as unknown as { situationChange: { subscribe: (fn: (v: string) => void) => void } }).situationChange.subscribe((v) => (emitted = v));
    chip.click();
    expect(emitted.length).toBeGreaterThan(0);
  });

  it('shows the crisis alert only when the text contains a crisis signal', () => {
    const setSituation = (text: string) => {
      fixture.componentRef.setInput('situation', text);
      fixture.detectChanges();
    };
    setSituation('I am nervous about tomorrow');
    expect(fixture.nativeElement.querySelector('app-crisis-alert')).toBeNull();

    setSituation('Chcem sa zabiť');
    expect(fixture.nativeElement.querySelector('app-crisis-alert')).toBeTruthy();
  });
});
