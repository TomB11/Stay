import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationKey } from '../../../core/i18n/translation-key.type';
import { SessionFeedback } from '../../../sessions/models/session-feedback.type';

@Component({
  selector: 'app-summary-section',
  standalone: true,
  templateUrl: './summary-section.component.html',
  styleUrl: './summary-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummarySectionComponent {
  @Input() anxietyLevel = 5;
  @Input() finalAnxietyLevel = 5;
  @Input() feedback: SessionFeedback | null = null;
  @Output() protected readonly restarted = new EventEmitter<void>();
  protected readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
