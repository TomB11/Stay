import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { CRISIS_CONTACTS } from '../../now/constants/crisis-contacts.constant';

@Component({
  selector: 'app-crisis-contacts',
  standalone: true,
  templateUrl: './crisis-contacts.component.html',
  styleUrl: './crisis-contacts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrisisContactsComponent {
  protected readonly language = inject(LanguageService);
  protected readonly contacts = computed(
    () => CRISIS_CONTACTS[this.language.currentLanguage()],
  );

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
