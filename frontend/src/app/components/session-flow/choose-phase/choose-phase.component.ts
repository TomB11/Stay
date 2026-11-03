import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslationKey } from '../../../core/i18n/translation-key.type';
import { SessionPhase } from '../../../sessions/models/session-phase.type';

@Component({
  selector: 'app-choose-phase',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './choose-phase.component.html',
  styleUrl: './choose-phase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoosePhaseComponent {
  @Output() protected readonly phaseSelected = new EventEmitter<SessionPhase>();
  protected readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
  protected selectPhase(phase: SessionPhase): void {
    this.phaseSelected.emit(phase);
  }
}
