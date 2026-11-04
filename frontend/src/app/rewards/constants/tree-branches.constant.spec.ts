import { MAX_TREE_BRANCHES, treeBranch, treeBranchesFor } from './tree-branches.constant';

describe('tree branches', () => {
  it('adds a branch every few steps after the tree is full grown', () => {
    expect(treeBranchesFor(15, 15).length).toBe(0);
    expect(treeBranchesFor(17, 15).length).toBe(0);
    expect(treeBranchesFor(18, 15).length).toBe(1);
    expect(treeBranchesFor(30, 15).length).toBe(5);
  });

  it('keeps existing branches stable and caps the drawing', () => {
    expect(treeBranchesFor(30, 15)[0]).toEqual(treeBranch(0));
    expect(treeBranchesFor(10000, 15).length).toBe(MAX_TREE_BRANCHES);
  });
});