import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import {
  DEFAULT_EXPECTED_ANXIETY,
  MAX_ANXIETY,
  MAX_STEP_TITLE_LENGTH,
  MIN_ANXIETY,
} from '../../exposure/constants/exposure.constant';
import { LADDER_PLACEHOLDERS, LADDER_STARTERS } from '../../exposure/constants/ladder-prompts.constant';
import { stepStatuses } from '../../exposure/exposure-progress';
import { ExposureStep } from '../../exposure/models/exposure-step.interface';
import { InfoTipComponent } from '../info-tip/info-tip.component';
import { PromptStartersComponent } from '../prompt-starters/prompt-starters.component';

@Component({
  standalone: true,
  selector: 'app-exposure-ladder',
  imports: [FormsModule, InfoTipComponent, PromptStartersComponent],
  templateUrl: './exposure-ladder.component.html',
  styleUrl: './exposure-ladder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExposureLadderComponent implements OnInit {
  protected readonly minAnxiety = MIN_ANXIETY;
  protected readonly maxAnxiety = MAX_ANXIETY;
  protected readonly maxTitleLength = MAX_STEP_TITLE_LENGTH;
  protected readonly steps = signal<ExposureStep[]>([]);
  protected readonly statuses = computed(() => stepStatuses(this.steps()));
  protected readonly error = signal(false);
  protected readonly newTitle = signal('');
  protected readonly newExpected = signal(DEFAULT_EXPECTED_ANXIETY);
  protected readonly activeStepId = signal<string | null>(null);
  protected readonly focused = signal(false);
  protected readonly starters = LADDER_STARTERS;
  /** Random per visit so the example placeholder is not always the same. */
  private readonly seed = Math.floor(Math.random() * 1000);
  protected get placeholder(): string {
    return this.t(LADDER_PLACEHOLDERS[this.seed % LADDER_PLACEHOLDERS.length]);
  }
  protected readonly before = signal(DEFAULT_EXPECTED_ANXIETY);
  protected readonly after = signal(DEFAULT_EXPECTED_ANXIETY);
  protected readonly language = inject(LanguageService);
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected addStarter(text: string): void {
    const current = this.newTitle().trim();
    this.newTitle.set((current ? `${current} ${text}` : text).slice(0, this.maxTitleLength));
  }

  protected addStep(): void {
    const title = this.newTitle().trim();
    if (!title) return;
    this.error.set(false);
    this.api.addExposureStep({ title, expectedAnxiety: this.newExpected() }).subscribe({
      next: () => {
        this.newTitle.set('');
        this.load();
      },
      error: () => this.error.set(true),
    });
  }

  protected openAttempt(step: ExposureStep): void {
    this.before.set(step.expectedAnxiety);
    this.after.set(step.expectedAnxiety);
    this.activeStepId.set(step.id);
  }

  protected saveAttempt(stepId: string): void {
    this.error.set(false);
    this.api
      .addExposureAttempt(stepId, {
        anxietyBefore: this.before(),
        anxietyAfter: this.after(),
      })
      .subscribe({
        next: () => {
          this.activeStepId.set(null);
          this.load();
        },
        error: () => this.error.set(true),
      });
  }

  protected removeStep(stepId: string): void {
    this.error.set(false);
    this.api.deleteExposureStep(stepId).subscribe({
      next: () => this.load(),
      error: () => this.error.set(true),
    });
  }

  private load(): void {
    this.api.getExposureSteps().subscribe({
      next: (steps) => this.steps.set(steps),
      error: () => this.error.set(true),
    });
  }
}
