import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { detectCrisis } from '../../../core/crisis/crisis-detector';
import { MAX_SITUATION_LENGTH } from '../../../core/api.constant';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationKey } from '../../../core/i18n/translation-key.type';
import { SITUATION_PROMPTS } from '../../../sessions/constants/situation-prompts.constant';
import { SessionPhase } from '../../../sessions/models/session-phase.type';
import { CrisisAlertComponent } from '../../crisis-alert/crisis-alert.component';
import { InfoTipComponent } from '../../info-tip/info-tip.component';
import { PromptStartersComponent } from '../../prompt-starters/prompt-starters.component';

@Component({
  standalone: true,
  selector: 'app-describe-situation',
  imports: [FormsModule, CrisisAlertComponent, InfoTipComponent, PromptStartersComponent],
  templateUrl: './describe-situation.component.html',
  styleUrl: './describe-situation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescribeSituationComponent {
  @Input() situation = '';
  @Input() anxietyLevel = 5;
  @Input() phase: SessionPhase = 'unsure';
  protected focused = false;
  /** Random per visit so the example placeholder is not always the same. */
  private readonly seed = Math.floor(Math.random() * 1000);
  @Output() protected readonly situationChange = new EventEmitter<string>();
  @Output() protected readonly anxietyLevelChange = new EventEmitter<number>();
  @Output() protected readonly continued = new EventEmitter<void>();
  @Output() protected readonly back = new EventEmitter<void>();
  protected readonly language = inject(LanguageService);
  protected readonly maxLength = MAX_SITUATION_LENGTH;
  protected get crisisDetected(): boolean {
    return detectCrisis(this.situation);
  }

  protected get prompts() {
    return SITUATION_PROMPTS[this.phase];
  }
  protected get placeholder(): string {
    const options = this.prompts.placeholders;
    return this.t(options[this.seed % options.length]);
  }
  protected addStarter(text: string): void {
    const current = this.situation.trim();
    this.updateSituation(current ? ` ${text}` : text);
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
  protected updateSituation(value: string): void {
    this.situationChange.emit(value);
  }
  protected updateAnxietyLevel(value: number): void {
    this.anxietyLevelChange.emit(value);
  }
}
