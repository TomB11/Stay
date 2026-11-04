export interface TreeLeaf {
  x: number;
  y: number;
  rotation: number;
  shade: number;
}

export const MAX_TREE_LEAVES = 60;

const CANOPY_CENTER_X = 100;
const CANOPY_CENTER_Y = 70;
const CANOPY_RADIUS_X = 70;
const CANOPY_RADIUS_Y = 55;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Leaves are spread over the canopy in a sunflower pattern, so the tree fills evenly from the middle out. */
export const TREE_LEAVES: readonly TreeLeaf[] = Array.from({ length: MAX_TREE_LEAVES }, (_, index) => {
  const distance = Math.sqrt((index + 0.5) / MAX_TREE_LEAVES);
  const angle = index * GOLDEN_ANGLE;
  return {
    x: Math.round((CANOPY_CENTER_X + Math.cos(angle) * distance * CANOPY_RADIUS_X) * 10) / 10,
    y: Math.round((CANOPY_CENTER_Y + Math.sin(angle) * distance * CANOPY_RADIUS_Y) * 10) / 10,
    rotation: Math.round((angle * 180) / Math.PI) % 360,
    shade: index % 3,
  };
});
