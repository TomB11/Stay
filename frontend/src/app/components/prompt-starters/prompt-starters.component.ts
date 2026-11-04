import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';

/** Clickable sentence starters shown under a focused text field. */
@Component({
  standalone: true,
  selector: 'app-prompt-starters',
  templateUrl: './prompt-starters.component.html',
  styleUrl: './prompt-starters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptStartersComponent {
  readonly keys = input.required<readonly TranslationKey[]>();
  readonly picked = output<string>();
  private readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}