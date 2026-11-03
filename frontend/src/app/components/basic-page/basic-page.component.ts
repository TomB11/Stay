import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { PageContent } from '../../shared/models/page-content.interface';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { SessionHistoryComponent } from '../session-history/session-history.component';

@Component({
  standalone: true,
  selector: 'app-basic-page',
  imports: [
    AccountSettingsComponent,
    AppHeaderComponent,
    RouterLink,
    SessionHistoryComponent,
  ],
  templateUrl: './basic-page.component.html',
  styleUrl: './basic-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPageComponent {
  protected readonly content = inject(ActivatedRoute).snapshot.data as PageContent;
  private readonly language = inject(LanguageService);
  protected t = this.language.translate.bind(this.language);
}
