import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { LEGAL_PAGES } from '../../legal/legal-pages.constant';
import { LegalPageId } from '../../legal/legal-page.interface';
import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  standalone: true,
  selector: 'app-legal-page',
  imports: [AppHeaderComponent, RouterLink],
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageComponent {
  private readonly language = inject(LanguageService);
  protected readonly page =
    LEGAL_PAGES[inject(ActivatedRoute).snapshot.data['legal'] as LegalPageId];
  protected t = this.language.translate.bind(this.language);
}
