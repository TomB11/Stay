import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { ThemeMode } from './theme-mode.type';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly mode = signal<ThemeMode>((localStorage.getItem('stay-theme') as ThemeMode) || 'system');
  readonly isDark = computed(() => {
    if (this.mode() === 'dark') return true;
    if (this.mode() === 'light') return false;
    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
  });

  constructor() {
    effect(() => {
      const dark = this.isDark();
      this.document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
      localStorage.setItem('stay-theme', this.mode());
    });
  }

  /** Switches between the user's light and dark appearance preference. */
  toggle(): void {
    this.mode.set(this.isDark() ? 'light' : 'dark');
  }
}
