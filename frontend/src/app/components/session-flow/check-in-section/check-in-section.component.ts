import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationKey } from '../../../core/i18n/translation-key.type';
import { SessionFeedback } from '../../../sessions/models/session-feedback.type';

@Component({
  standalone: true,
  selector: 'app-check-in-section',
  imports: [FormsModule],
  templateUrl: './check-in-section.component.html',
  styleUrl: './check-in-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckInSectionComponent {
  @Input() finalAnxietyLevel = 5;
  @Output() protected readonly finalAnxietyLevelChange = new EventEmitter<number>();
  @Output() protected readonly feedbackSelected = new EventEmitter<SessionFeedback>();
  protected readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
  protected updateAnxietyLevel(value: number): void {
    this.finalAnxietyLevelChange.emit(value);
  }
}
