export interface TreeNode {
  title: string;
  contentWidth: number;
  contentHeight: number;
  id?: string;
  children?: TreeNode[];
}
