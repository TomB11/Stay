import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { CrisisContactsComponent } from '../crisis-contacts/crisis-contacts.component';

/** Non-blocking notice shown next to free-text fields when a crisis signal is detected. */
@Component({
  selector: 'app-crisis-alert',
  standalone: true,
  imports: [CrisisContactsComponent],
  templateUrl: './crisis-alert.component.html',
  styleUrl: './crisis-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrisisAlertComponent {
  private readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
