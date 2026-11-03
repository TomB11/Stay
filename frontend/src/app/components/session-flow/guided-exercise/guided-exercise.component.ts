import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { detectCrisis } from '../../../core/crisis/crisis-detector';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationKey } from '../../../core/i18n/translation-key.type';
import { GuidedStep } from '../../../sessions/models/guided-step.interface';
import { CrisisAlertComponent } from '../../crisis-alert/crisis-alert.component';

/** Walks the user through one reflective question at a time. Answers stay on the device. */
@Component({
  selector: 'app-guided-exercise',
  standalone: true,
  imports: [FormsModule, CrisisAlertComponent],
  templateUrl: './guided-exercise.component.html',
  styleUrl: './guided-exercise.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuidedExerciseComponent {
  readonly steps = input.required<readonly GuidedStep[]>();
  readonly situation = input('');
  readonly completed = output<void>();
  protected readonly language = inject(LanguageService);
  protected readonly index = signal(0);
  private readonly answers = signal<Record<string, string>>({});
  protected readonly step = computed(() => this.steps()[this.index()]);
  protected readonly isLast = computed(() => this.index() === this.steps().length - 1);
  protected readonly answer = computed(() => this.answers()[this.step().id] ?? '');
  protected readonly crisisDetected = computed(
    () => this.step().kind === 'text' && detectCrisis(this.answer()),
  );

  protected setAnswer(value: string): void {
    const id = this.step().id;
    this.answers.update((answers) => ({ ...answers, [id]: value }));
  }

  protected next(): void {
    if (this.isLast()) {
      this.completed.emit();
      return;
    }
    this.index.update((index) => index + 1);
  }

  protected previous(): void {
    this.index.update((index) => Math.max(0, index - 1));
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
