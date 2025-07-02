export class UIStore {
  private activeNode: string | null = null;
  private selectedNodes: string[] = [];

  setActiveNode(nodeId: string): void {
    this.activeNode = nodeId;
  }

  getActiveNode(): string | null {
    return this.activeNode;
  }

  setSelectedNodes(nodeIds: string[]): void {
    this.selectedNodes = nodeIds;
  }

  getSelectedNodes(): string[] {
    return this.selectedNodes;
  }

  toggleNodeExpansion(nodeId: string): void {
    // placeholder for expansion toggle
  }
}
