import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { Insights } from '../../progress/models/insights.interface';
import { TREND_MESSAGE, trendDirection } from '../../progress/progress-trend';
import { SESSION_PHASE_LABEL } from '../../sessions/constants/session-phase-label.constant';
import { SessionPhase } from '../../sessions/models/session-phase.type';
import { RewardsComponent } from '../rewards/rewards.component';

@Component({
  standalone: true,
  selector: 'app-progress',
  imports: [RouterLink, RewardsComponent],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent implements OnInit {
  protected readonly insights = signal<Insights | null>(null);
  protected readonly error = signal(false);
  protected readonly trendMessage = computed(() => {
    const data = this.insights();
    return data ? TREND_MESSAGE[trendDirection(data.averageIntensity)] : 'progressNotEnough';
  });
  protected readonly language = inject(LanguageService);
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.api.getInsights().subscribe({
      next: (data) => this.insights.set(data),
      error: () => this.error.set(true),
    });
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected phaseLabel(phase: SessionPhase): string {
    return this.t(SESSION_PHASE_LABEL[phase]);
  }

  /** Formats a number with a decimal comma or point depending on the language. */
  protected format(value: number | null): string {
    return value === null ? '–' : this.language.formatNumber(value);
  }
}
