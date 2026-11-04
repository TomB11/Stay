import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Language } from '../../core/i18n/language.enum';
import { LanguageService } from '../../core/i18n/language.service';
import { AuthService } from '../../core/auth.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { ThemeService } from '../../core/theme.service';
import { MORE_NAV_LINKS, USER_NAV_LINKS } from './user-nav-links.constant';

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
  protected readonly moreLinks = MORE_NAV_LINKS;
  protected readonly theme = inject(ThemeService);
  protected readonly menuOpen = signal(false);
  protected readonly moreOpen = signal(false);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected signOut(): void {
    this.auth.logout();
    this.menuOpen.set(false);
    this.moreOpen.set(false);
    void this.router.navigate(['/home']);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected toggleMore(): void {
    this.moreOpen.update((open) => !open);
  }

  @HostListener('document:keydown.escape')
  protected closeMore(): void {
    this.moreOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected closeMoreOnOutsideClick(event: MouseEvent): void {
    const more = this.host.nativeElement.querySelector('.more');
    if (more && !more.contains(event.target as Node)) this.moreOpen.set(false);
  }
}
