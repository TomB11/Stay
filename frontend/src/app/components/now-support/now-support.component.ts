import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { NowStep } from '../../now/models/now-step.type';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { BreathingGuideComponent } from './breathing-guide/breathing-guide.component';
import { CrisisHelpComponent } from './crisis-help/crisis-help.component';
import { GroundingGuideComponent } from './grounding-guide/grounding-guide.component';
import { RelaxationGuideComponent } from './relaxation-guide/relaxation-guide.component';

/** Immediate help for acute anxiety: no sign-in, no typing, starts breathing at once. */
@Component({
  selector: 'app-now-support',
  standalone: true,
  imports: [
    AppHeaderComponent,
    BreathingGuideComponent,
    CrisisHelpComponent,
    GroundingGuideComponent,
    RelaxationGuideComponent,
    RouterLink,
  ],
  templateUrl: './now-support.component.html',
  styleUrl: './now-support.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowSupportComponent {
  protected readonly language = inject(LanguageService);
  protected readonly step = signal<NowStep>('breathing');

  protected go(step: NowStep): void {
    this.step.set(step);
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
