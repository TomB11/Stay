export interface TreeBranch {
  path: string;
  leaves: readonly { x: number; y: number; rotation: number; shade: number }[];
}

/** A full-grown tree gets one new branch for every this many further brave steps. */
export const STEPS_PER_BRANCH = 3;
/** Rendering limit; beyond it the tree keeps counting but the drawing stays readable. */
export const MAX_TREE_BRANCHES = 40;

const TRUNK_X = 100;
const LOWEST_BRANCH_Y = 176;
const BRANCH_Y_SPREAD = 60;

/** Branch k is fully determined by its index, so the tree never reshuffles when it grows. */
export function treeBranch(index: number): TreeBranch {
  const side = index % 2 === 0 ? -1 : 1;
  const level = Math.floor(index / 2);
  const startY = LOWEST_BRANCH_Y - ((level * 17) % BRANCH_Y_SPREAD);
  const length = 32 + (level % 6) * 9;
  const tipX = TRUNK_X + side * length;
  const tipY = startY - 18 - (level % 4) * 5;
  const midX = TRUNK_X + side * length * 0.45;
  const midY = startY - 4;
  const leaves = [0, 1, 2].map((n) => ({
    x: Math.round((tipX - side * n * 7) * 10) / 10,
    y: Math.round((tipY + n * 4 - 4) * 10) / 10,
    rotation: (side * 25 + n * 40 + level * 13) % 360,
    shade: (index + n) % 3,
  }));
  return { path: `M${TRUNK_X} ${startY} Q${midX} ${midY} ${tipX} ${tipY}`, leaves };
}

export function treeBranchesFor(actions: number, fullGrownFrom: number): TreeBranch[] {
  const count = Math.min(
    MAX_TREE_BRANCHES,
    Math.max(0, Math.floor((actions - fullGrownFrom) / STEPS_PER_BRANCH)),
  );
  return Array.from({ length: count }, (_, index) => treeBranch(index));
}