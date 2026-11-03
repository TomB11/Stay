import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Language } from '../../core/i18n/language.enum';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { PHASE_GUIDANCE } from '../../sessions/constants/phase-guidance.constant';
import { GUIDED_STEPS } from '../../sessions/constants/guided-steps.constant';
import { SessionFeedback } from '../../sessions/models/session-feedback.type';
import { SessionPhase } from '../../sessions/models/session-phase.type';
import { SessionStep } from '../../sessions/models/session-step.type';
import { CheckInSectionComponent } from './check-in-section/check-in-section.component';
import { ChoosePhaseComponent } from './choose-phase/choose-phase.component';
import { DescribeSituationComponent } from './describe-situation/describe-situation.component';
import { GuidedExerciseComponent } from './guided-exercise/guided-exercise.component';
import { SummarySectionComponent } from './summary-section/summary-section.component';
import { SupportSectionComponent } from './support-section/support-section.component';
import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  standalone: true,
  selector: 'app-session-flow',
  imports: [
    AppHeaderComponent,
    CheckInSectionComponent,
    ChoosePhaseComponent,
    DescribeSituationComponent,
    GuidedExerciseComponent,
    SummarySectionComponent,
    SupportSectionComponent,
  ],
  templateUrl: './session-flow.component.html',
  styleUrl: './session-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionFlowComponent {
  protected readonly language = inject(LanguageService);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  protected readonly languages = Language;
  protected readonly selectedPhase = signal<SessionPhase | null>(null);
  protected readonly currentStep = signal<SessionStep>('choose');
  protected readonly anxietyLevel = signal(5);
  protected readonly finalAnxietyLevel = signal(5);
  protected readonly feedback = signal<SessionFeedback | null>(null);
  protected readonly guidance = computed(() => PHASE_GUIDANCE[this.selectedPhase() ?? 'unsure']);
  protected readonly guidedSteps = computed(() => {
    const phase = this.selectedPhase();
    return phase ? GUIDED_STEPS[phase] : undefined;
  });
  protected readonly situation = signal('');

  protected selectPhase(phase: SessionPhase): void {
    this.selectedPhase.set(phase);
    this.currentStep.set('describe');
  }
  protected continueToSupport(): void {
    if (this.situation().trim()) {
      this.currentStep.set('support');
    }
  }
  protected completeIntervention(): void {
    this.currentStep.set('check-in');
  }
  protected finishSession(feedback: SessionFeedback): void {
    this.feedback.set(feedback);
    if (this.auth.token()) {
      this.api
        .saveSession({
          phase: this.selectedPhase() ?? 'unsure',
          situation: this.situation().trim(),
          initialIntensity: this.anxietyLevel(),
          finalIntensity: this.finalAnxietyLevel(),
          feedback,
        })
        .subscribe();
    }
    this.currentStep.set('summary');
  }
  protected startOver(): void {
    this.selectedPhase.set(null);
    this.currentStep.set('choose');
    this.situation.set('');
    this.anxietyLevel.set(5);
    this.finalAnxietyLevel.set(5);
    this.feedback.set(null);
  }
  protected updateSituation(situation: string): void {
    this.situation.set(situation);
  }
  protected updateAnxietyLevel(level: number): void {
    this.anxietyLevel.set(level);
  }
  protected updateFinalAnxietyLevel(level: number): void {
    this.finalAnxietyLevel.set(level);
  }
  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
