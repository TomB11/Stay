import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationKey } from '../../../core/i18n/translation-key.type';
import { CrisisContactsComponent } from '../../crisis-contacts/crisis-contacts.component';

@Component({
  selector: 'app-crisis-help',
  standalone: true,
  imports: [CrisisContactsComponent],
  templateUrl: './crisis-help.component.html',
  styleUrl: './crisis-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrisisHelpComponent {
  @Output() readonly closed = new EventEmitter<void>();
  private readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
