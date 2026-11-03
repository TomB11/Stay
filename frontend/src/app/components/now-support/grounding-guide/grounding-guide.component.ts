import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationKey } from '../../../core/i18n/translation-key.type';
import { GROUNDING_STEP_KEYS } from '../../../now/constants/grounding-steps.constant';

@Component({
  selector: 'app-grounding-guide',
  standalone: true,
  templateUrl: './grounding-guide.component.html',
  styleUrl: './grounding-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroundingGuideComponent {
  @Output() readonly finished = new EventEmitter<void>();
  protected readonly language = inject(LanguageService);
  private readonly stepIndex = signal(0);
  protected readonly stepKey = computed(() => GROUNDING_STEP_KEYS[this.stepIndex()]);
  protected readonly stepNumber = computed(() => GROUNDING_STEP_KEYS.length - this.stepIndex());

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected next(): void {
    if (this.stepIndex() >= GROUNDING_STEP_KEYS.length - 1) {
      this.finished.emit();
      return;
    }
    this.stepIndex.update((index) => index + 1);
  }
}
