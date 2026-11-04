import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import {
  BADGE_TIER_KEYS,
  LADDER_BADGES,
  badgeLevelFor,
} from '../../rewards/constants/ladder-badges.constant';
import { InfoTipComponent } from '../info-tip/info-tip.component';
import { LadderStats } from '../../rewards/models/rewards.interface';

@Component({
  standalone: true,
  imports: [InfoTipComponent],
  selector: 'app-ladder-badges',
  templateUrl: './ladder-badges.component.html',
  styleUrl: './ladder-badges.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LadderBadgesComponent {
  readonly ladder = input.required<LadderStats>();
  readonly actions = input(0);
  protected readonly badges = computed(() => {
    const stats = { ...this.ladder(), actions: this.actions() };
    const items = LADDER_BADGES.map((badge) => {
      const progress = badgeLevelFor(badge, stats);
      return {
        ...progress,
        id: badge.id,
        icon: badge.icon,
        titleKey: badge.titleKey,
        descriptionKey: badge.descriptionKey,
        tierKey: progress.level > 0 ? BADGE_TIER_KEYS[progress.level - 1] : null,
        maxLevel: badge.levels.length,
        ratio: progress.next === null ? -1 : progress.value / progress.next,
      };
    });
    const focusId = items.reduce((best, item) => (item.ratio > best.ratio ? item : best)).id;
    return items.map((item) => ({ ...item, focus: item.id === focusId && item.ratio >= 0 }));
  });
  private readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}