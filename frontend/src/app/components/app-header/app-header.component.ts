import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Language } from '../../core/i18n/language.enum';
import { LanguageService } from '../../core/i18n/language.service';
import { AuthService } from '../../core/auth.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { ThemeService } from '../../core/theme.service';
import { USER_NAV_LINKS } from './user-nav-links.constant';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  @Input() showAction = false;

  protected readonly language = inject(LanguageService);
  protected readonly auth = inject(AuthService);
  protected readonly languages = Language;
  protected readonly userLinks = USER_NAV_LINKS;
  protected readonly theme = inject(ThemeService);
  protected readonly menuOpen = signal(false);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected signOut(): void {
    this.auth.logout();
    this.menuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
