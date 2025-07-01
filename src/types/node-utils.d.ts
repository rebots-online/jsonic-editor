import { NodeType } from './core';
import React from 'react';

declare module '../../utils/node-utils' {
  export const getNodeIcon: (type: NodeType) => React.ReactNode;
  export const getNodePath: (nodes: any[], nodeId: string, path?: string[]) => string[] | null;
  export const findNodeById: (nodes: any[], id: string) => any;
  export const updateNodeInTree: (nodes: any[], nodeId: string, updates: any) => any[];
}
