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
import { PhaseGuidance } from '../../../sessions/models/phase-guidance.interface';

@Component({
  selector: 'app-support-section',
  standalone: true,
  templateUrl: './support-section.component.html',
  styleUrl: './support-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportSectionComponent {
  @Input({ required: true }) guidance!: PhaseGuidance;
  @Input() situation = '';
  @Output() protected readonly completed = new EventEmitter<void>();
  protected readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
