import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { DASHBOARD_TABS } from '../../rewards/constants/dashboard-tabs.constant';
import { DashboardTab } from '../../rewards/models/dashboard-tab.type';
import { RewardsOverview } from '../../rewards/models/rewards.interface';
import { CourageTreeComponent } from '../courage-tree/courage-tree.component';
import { DailyMissionComponent } from '../daily-mission/daily-mission.component';
import { LadderBadgesComponent } from '../ladder-badges/ladder-badges.component';
import { RewardsComponent } from '../rewards/rewards.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CourageTreeComponent,
    DailyMissionComponent,
    LadderBadgesComponent,
    RewardsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly overview = signal<RewardsOverview | null>(null);
  protected readonly error = signal(false);
  protected readonly activeTab = signal<DashboardTab>('mission');
  protected readonly tabs = DASHBOARD_TABS;
  private readonly language = inject(LanguageService);
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.api.getRewards().subscribe({
      next: (data) => this.overview.set(data),
      error: () => this.error.set(true),
    });
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected selectTab(tab: DashboardTab): void {
    this.activeTab.set(tab);
  }
}
