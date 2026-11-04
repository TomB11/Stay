import { TranslationKey } from '../../core/i18n/translation-key.type';

export type TreeStageId = 'seed' | 'sprout' | 'sapling' | 'tree';

export interface TreeStage {
  id: TreeStageId;
  /** Minimum number of brave steps that reaches this stage. */
  fromActions: number;
  /** Size of the whole plant relative to the full-grown tree. */
  scale: number;
  titleKey: TranslationKey;
}

export const TREE_STAGES: readonly TreeStage[] = [
  { id: 'seed', fromActions: 0, scale: 0.2, titleKey: 'treeStageSeed' },
  { id: 'sprout', fromActions: 1, scale: 0.42, titleKey: 'treeStageSprout' },
  { id: 'sapling', fromActions: 5, scale: 0.72, titleKey: 'treeStageSapling' },
  { id: 'tree', fromActions: 15, scale: 1, titleKey: 'treeStageTree' },
];

/** From this many brave steps on, the tree is full grown and only adds new branches. */
export const FULL_GROWN_ACTIONS = TREE_STAGES[TREE_STAGES.length - 1].fromActions;

export function treeStageFor(actions: number): { stage: TreeStage; next: TreeStage | null } {
  let index = 0;
  TREE_STAGES.forEach((stage, i) => {
    if (actions >= stage.fromActions) index = i;
  });
  return { stage: TREE_STAGES[index], next: TREE_STAGES[index + 1] ?? null };
}
