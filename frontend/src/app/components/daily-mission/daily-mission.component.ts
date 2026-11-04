import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { pickDailyMission } from '../../rewards/daily-mission';
import { ActionsToday } from '../../rewards/models/rewards.interface';

@Component({
  standalone: true,
  selector: 'app-daily-mission',
  imports: [RouterLink],
  templateUrl: './daily-mission.component.html',
  styleUrl: './daily-mission.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyMissionComponent {
  readonly today = input.required<ActionsToday>();
  protected readonly mission = pickDailyMission(new Date());
  protected readonly done = computed(() => this.today()[this.mission.counter] > 0);
  private readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
