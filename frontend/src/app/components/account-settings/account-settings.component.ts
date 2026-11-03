import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';

@Component({
  standalone: true,
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent {
  protected readonly language = inject(LanguageService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly confirmingDelete = signal(false);
  protected readonly error = signal(false);

  /** Saves all stored account data as a JSON file in the browser. */
  protected exportData(): void {
    this.error.set(false);
    this.auth.exportData().subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'stay-data.json';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.error.set(true),
    });
  }

  protected deleteAccount(): void {
    this.error.set(false);
    this.auth.deleteAccount().subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => this.error.set(true),
    });
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
