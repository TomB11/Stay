import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { LADDER_BADGES } from '../../rewards/constants/ladder-badges.constant';
import { LadderStats } from '../../rewards/models/rewards.interface';

@Component({
  standalone: true,
  selector: 'app-ladder-badges',
  templateUrl: './ladder-badges.component.html',
  styleUrl: './ladder-badges.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LadderBadgesComponent {
  readonly ladder = input.required<LadderStats>();
  protected readonly badges = computed(() =>
    LADDER_BADGES.map((badge) => ({ ...badge, earned: badge.isEarned(this.ladder()) })),
  );
  private readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
