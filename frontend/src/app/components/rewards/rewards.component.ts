import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { MAX_REWARD_TITLE_LENGTH } from '../../rewards/constants/rewards-limits.constant';
import { InfoTipComponent } from '../info-tip/info-tip.component';
import { OpenedReward, RewardsOverview } from '../../rewards/models/rewards.interface';

@Component({
  standalone: true,
  selector: 'app-rewards',
  imports: [FormsModule, InfoTipComponent],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardsComponent implements OnInit {
  protected readonly overview = signal<RewardsOverview | null>(null);
  protected readonly title = signal('');
  protected readonly error = signal(false);
  protected readonly revealed = signal<OpenedReward | null>(null);
  protected readonly maxTitle = MAX_REWARD_TITLE_LENGTH;
  protected readonly wrapped = computed(
    () => this.overview()?.rewards.filter((reward) => !reward.openedAt) ?? [],
  );
  protected readonly opened = computed(
    () => this.overview()?.rewards.filter((reward) => reward.openedAt) ?? [],
  );
  protected readonly progressPercent = computed(() => {
    const data = this.overview();
    if (!data) return 0;
    return ((data.actionsPerGift - data.actionsToNextGift) / data.actionsPerGift) * 100;
  });
  protected readonly language = inject(LanguageService);
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected add(): void {
    const title = this.title().trim();
    if (!title) return;
    this.api.addReward(title).subscribe({
      next: () => {
        this.title.set('');
        this.load();
      },
      error: () => this.error.set(true),
    });
  }

  protected openGift(): void {
    this.api.openGift().subscribe({
      next: (reward) => {
        this.revealed.set(reward);
        this.load();
      },
      error: () => this.error.set(true),
    });
  }

  protected redeem(rewardId: string): void {
    this.api.redeemReward(rewardId).subscribe({
      next: () => {
        this.revealed.set(null);
        this.load();
      },
      error: () => this.error.set(true),
    });
  }

  protected remove(rewardId: string): void {
    this.api.deleteReward(rewardId).subscribe({
      next: () => this.load(),
      error: () => this.error.set(true),
    });
  }

  private load(): void {
    this.api.getRewards().subscribe({
      next: (data) => {
        this.error.set(false);
        this.overview.set(data);
      },
      error: () => this.error.set(true),
    });
  }
}
