export class UIStore {
    constructor() {
        this.activeNode = null;
        this.selectedNodes = [];
    }
    setActiveNode(nodeId) {
        this.activeNode = nodeId;
    }
    getActiveNode() {
        return this.activeNode;
    }
    setSelectedNodes(nodeIds) {
        this.selectedNodes = nodeIds;
    }
    getSelectedNodes() {
        return this.selectedNodes;
    }
    toggleNodeExpansion(nodeId) {
        // placeholder for expansion toggle
    }
}
