import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { detectCrisis } from '../../core/crisis/crisis-detector';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import {
  DIARY_DEFAULT_INTENSITY,
  DIARY_EMOTIONS,
  DIARY_MAX_EMOTION_LENGTH,
  DIARY_MAX_TEXT_LENGTH,
} from '../../diary/constants/diary.constant';
import {
  DIARY_PROMPTS,
  DiaryPromptField,
} from '../../diary/constants/diary-prompts.constant';
import { DiaryEntry } from '../../diary/models/diary-entry.interface';
import { CrisisAlertComponent } from '../crisis-alert/crisis-alert.component';
import { InfoTipComponent } from '../info-tip/info-tip.component';

@Component({
  standalone: true,
  selector: 'app-diary',
  imports: [CrisisAlertComponent, DatePipe, FormsModule, InfoTipComponent],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiaryComponent implements OnInit {
  protected readonly emotions = DIARY_EMOTIONS;
  protected readonly maxText = DIARY_MAX_TEXT_LENGTH;
  protected readonly maxEmotion = DIARY_MAX_EMOTION_LENGTH;
  protected readonly entries = signal<DiaryEntry[]>([]);
  protected readonly error = signal(false);
  protected readonly situation = signal('');
  protected readonly thought = signal('');
  protected readonly emotion = signal('');
  protected readonly alternative = signal('');
  protected readonly intensityBefore = signal(DIARY_DEFAULT_INTENSITY);
  protected readonly intensityAfter = signal(DIARY_DEFAULT_INTENSITY);
  protected readonly canSave = computed(
    () => Boolean(this.situation().trim() && this.thought().trim() && this.emotion().trim()),
  );
  protected readonly crisisDetected = computed(() =>
    detectCrisis(`${this.situation()} ${this.thought()} ${this.alternative()}`),
  );
  protected readonly focused = signal<DiaryPromptField | null>(null);
  protected readonly today = new Date();
  /** Changes on every visit and after each saved page, so example placeholders vary. */
  private readonly promptSeed = signal(Math.floor(Math.random() * 1000));
  protected readonly language = inject(LanguageService);
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
  }

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }

  protected placeholder(field: DiaryPromptField): string {
    const options = DIARY_PROMPTS[field].placeholders;
    return this.t(options[this.promptSeed() % options.length]);
  }

  protected starters(field: DiaryPromptField): readonly TranslationKey[] {
    return DIARY_PROMPTS[field].starters;
  }

  /** Appends a starter phrase to the focused field so the user can type less. */
  protected addStarter(field: DiaryPromptField, key: TranslationKey): void {
    const target = { situation: this.situation, thought: this.thought, alternative: this.alternative }[field];
    const current = target().trim();
    target.set(current ? `${current} ${this.t(key)}` : this.t(key));
  }

  protected pickEmotion(key: TranslationKey): void {
    this.emotion.set(this.t(key));
  }

  protected save(): void {
    if (!this.canSave()) return;
    this.error.set(false);
    this.api
      .addDiaryEntry({
        situation: this.situation().trim(),
        thought: this.thought().trim(),
        emotion: this.emotion().trim(),
        intensityBefore: this.intensityBefore(),
        alternativeThought: this.alternative().trim(),
        intensityAfter: this.intensityAfter(),
      })
      .subscribe({
        next: () => {
          this.resetForm();
          this.promptSeed.update((seed) => seed + 1);
          this.load();
        },
        error: () => this.error.set(true),
      });
  }

  protected remove(entryId: string): void {
    this.error.set(false);
    this.api.deleteDiaryEntry(entryId).subscribe({
      next: () => this.load(),
      error: () => this.error.set(true),
    });
  }

  private resetForm(): void {
    this.situation.set('');
    this.thought.set('');
    this.emotion.set('');
    this.alternative.set('');
    this.intensityBefore.set(DIARY_DEFAULT_INTENSITY);
    this.intensityAfter.set(DIARY_DEFAULT_INTENSITY);
  }

  private load(): void {
    this.api.getDiaryEntries().subscribe({
      next: (entries) => this.entries.set(entries),
      error: () => this.error.set(true),
    });
  }
}
