import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { TranslationKey } from '../../core/i18n/translation-key.type';
import { MAX_TREE_LEAVES, TREE_LEAVES } from '../../rewards/constants/tree-leaves.constant';
import { treeStageFor } from '../../rewards/constants/tree-stages.constant';

@Component({
  standalone: true,
  selector: 'app-courage-tree',
  templateUrl: './courage-tree.component.html',
  styleUrl: './courage-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourageTreeComponent {
  /** Total number of brave steps; each one grows a leaf and moves the tree toward the next stage. */
  readonly actions = input.required<number>();
  protected readonly stageInfo = computed(() => treeStageFor(this.actions()));
  protected readonly stage = computed(() => this.stageInfo().stage);
  protected readonly stepsToNextStage = computed(() => {
    const next = this.stageInfo().next;
    return next ? next.fromActions - this.actions() : 0;
  });
  protected readonly leaves = computed(() => TREE_LEAVES.slice(0, this.actions()));
  protected readonly extraLeaves = computed(() => Math.max(0, this.actions() - MAX_TREE_LEAVES));
  private readonly language = inject(LanguageService);

  protected t(key: TranslationKey): string {
    return this.language.translate(key);
  }
}
