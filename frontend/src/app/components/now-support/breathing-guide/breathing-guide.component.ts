import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationKey } from '../../../core/i18n/translation-key.type';
import {
  BREATHING_CYCLE_SECONDS,
  BREATHING_DURATION_SECONDS,
  BREATHING_INHALE_SECONDS,
} from '../../../now/constants/breathing.constant';
import { BreathingPhase } from '../../../now/models/breathing-phase.type';

@Component({
  selector: 'app-breathing-guide',
  standalone: true,
  templateUrl: './breathing-guide.component.html',
  styleUrl: './breathing-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreathingGuideComponent implements OnInit {
  @Output() readonly finished = new EventEmitter<void>();
  protected readonly cycleSeconds = BREATHING_CYCLE_SECONDS;
  protected readonly language = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elapsed = signal(0);
  protected readonly phase = computed<BreathingPhase>(() =>
    this.elapsed() % BREATHING_CYCLE_SECONDS < BREATHING_INHALE_SECONDS
      ? 'inhale'
      : 'exhale',
  );
  protected readonly phaseKey = computed<TranslationKey>(() =>
    this.phase() === 'inhale' ? 'breatheIn' : 'breatheOut',
  );
  protected readonly phaseSecondsLeft = computed(() => {
    const position = this.elapsed() % BREATHING_CYCLE_SECONDS;
    return this.phase() === 'inhale'
      ? BREATHING_INHALE_SECONDS - position
      : BREATHING_CYCLE_SECONDS - position;
  });

  ngOnInit(): void {
    const timer = setInterval(() => this.tick(), 1000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected finish(): void {
    this.finished.emit();
  }

  private tick(): void {
    const previousPhase = this.phase();
    this.elapsed.update((seconds) => seconds + 1);
    if (this.phase() !== previousPhase) {
      navigator.vibrate?.(this.phase() === 'inhale' ? 60 : 30);
    }
    if (this.elapsed() >= BREATHING_DURATION_SECONDS) {
      this.finished.emit();
    }
  }
}
