import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { SESSION_PHASE_LABEL } from '../../sessions/constants/session-phase-label.constant';
import { SessionRecord } from '../../sessions/models/session-record.interface';

@Component({
  standalone: true,
  selector: 'app-session-history',
  imports: [DatePipe],
  templateUrl: './session-history.component.html',
  styleUrl: './session-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionHistoryComponent implements OnInit {
  protected readonly sessions = signal<SessionRecord[]>([]);
  protected readonly language = inject(LanguageService);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    if (this.auth.token()) {
      this.api.getSessions().subscribe((sessions) => this.sessions.set(sessions));
    }
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected phaseLabel(session: SessionRecord): string {
    return this.t(SESSION_PHASE_LABEL[session.phase]);
  }
}
