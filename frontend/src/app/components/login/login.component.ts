import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [AppHeaderComponent, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected readonly language = inject(LanguageService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    if (this.auth.isAuthenticated()) {
      void this.router.navigate(['/home']);
    }
  }  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly registerMode = signal(false);
  protected readonly error = signal('');
  protected readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /** Switches between signing into an existing account and creating a new one. */
  protected toggleMode(): void {
    this.registerMode.update((mode) => !mode);
    this.error.set('');
  }

  /** Sends credentials to the API and returns to the check-in after success. */
  protected submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const request = this.registerMode()
      ? this.auth.register(this.email(), this.password())
      : this.auth.login(this.email(), this.password());
    request.subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => this.error.set(this.t('authError')),
    });
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
