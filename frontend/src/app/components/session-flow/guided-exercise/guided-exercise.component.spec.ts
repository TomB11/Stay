import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GUIDED_STEPS } from '../../../sessions/constants/guided-steps.constant';
import { GuidedExerciseComponent } from './guided-exercise.component';

describe('GuidedExerciseComponent', () => {
  let fixture: ComponentFixture<GuidedExerciseComponent>;
  const root = () => fixture.nativeElement as HTMLElement;
  const primary = () => root().querySelector('.primary') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidedExerciseComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(GuidedExerciseComponent);
    fixture.componentRef.setInput('steps', GUIDED_STEPS.before);
    fixture.componentRef.setInput('situation', 'Presentation');
    fixture.detectChanges();
  });

  it('shows the crisis alert when an answer contains a crisis signal', () => {
    const textarea = root().querySelector('textarea') as HTMLTextAreaElement;
    expect(root().querySelector('app-crisis-alert')).toBeNull();
    textarea.value = 'nechcem už žiť';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root().querySelector('app-crisis-alert')).toBeTruthy();
  });

  it('shows one question at a time with progress', () => {
    expect(root().querySelector('.progress')?.textContent).toContain('1 / 5');
    expect(root().querySelectorAll('textarea').length).toBe(1);
    expect(root().querySelector('.recap')?.textContent).toContain('Presentation');
  });

  it('renders choice steps as options and keeps the selection', () => {
    primary().click();
    fixture.detectChanges();
    const options = root().querySelectorAll<HTMLButtonElement>('.option');
    expect(options.length).toBe(4);

    options[1].click();
    fixture.detectChanges();
    expect(root().querySelector('.option.selected')).toBe(options[1]);
  });

  it('lets the user go back and emits completed after the last step', () => {
    let completed = 0;
    fixture.componentInstance.completed.subscribe(() => completed++);
    primary().click();
    fixture.detectChanges();
    (root().querySelector('.btn-back') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(root().querySelector('.progress')?.textContent).toContain('1 / 5');

    for (let i = 0; i < 5; i++) {
      primary().click();
      fixture.detectChanges();
    }
    expect(completed).toBe(1);
  });
});
