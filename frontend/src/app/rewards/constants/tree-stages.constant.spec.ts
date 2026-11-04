import { treeStageFor } from './tree-stages.constant';

describe('treeStageFor', () => {
  it('maps total steps to growth stages', () => {
    expect(treeStageFor(0).stage.id).toBe('seed');
    expect(treeStageFor(1).stage.id).toBe('sprout');
    expect(treeStageFor(4).stage.id).toBe('sprout');
    expect(treeStageFor(5).stage.id).toBe('sapling');
    expect(treeStageFor(15).stage.id).toBe('tree');
    expect(treeStageFor(15).next).toBeNull();
  });
});
