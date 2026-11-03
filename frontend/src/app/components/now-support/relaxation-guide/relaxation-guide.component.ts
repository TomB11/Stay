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
  RELAXATION_GROUP_KEYS,
  RELAXATION_GROUP_SECONDS,
  RELAXATION_TENSE_SECONDS,
} from '../../../now/constants/relaxation.constant';
import { RelaxationPhase } from '../../../now/models/relaxation-phase.type';

/** Progressive muscle relaxation: tense each muscle group briefly, then release it. */
@Component({
  selector: 'app-relaxation-guide',
  standalone: true,
  templateUrl: './relaxation-guide.component.html',
  styleUrl: './relaxation-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelaxationGuideComponent implements OnInit {
  @Output() readonly finished = new EventEmitter<void>();
  protected readonly language = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly groupIndex = signal(0);
  private readonly groupElapsed = signal(0);
  protected readonly groupCount = RELAXATION_GROUP_KEYS.length;
  protected readonly groupKey = computed(
    () => RELAXATION_GROUP_KEYS[this.groupIndex()],
  );
  protected readonly phase = computed<RelaxationPhase>(() =>
    this.groupElapsed() < RELAXATION_TENSE_SECONDS ? 'tense' : 'release',
  );
  protected readonly phaseKey = computed<TranslationKey>(() =>
    this.phase() === 'tense' ? 'relaxTense' : 'relaxRelease',
  );

  ngOnInit(): void {
    const timer = setInterval(() => this.tick(), 1000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected skip(): void {
    this.nextGroup();
  }

  private tick(): void {
    this.groupElapsed.update((seconds) => seconds + 1);
    if (this.groupElapsed() >= RELAXATION_GROUP_SECONDS) {
      this.nextGroup();
    }
  }

  private nextGroup(): void {
    if (this.groupIndex() >= this.groupCount - 1) {
      this.finished.emit();
      return;
    }
    this.groupIndex.update((index) => index + 1);
    this.groupElapsed.set(0);
  }
}
