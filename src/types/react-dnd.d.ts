declare module 'react-dnd' {
  export interface DndProviderProps {
    backend: any;
    children: React.ReactNode;
  }

  export const DndProvider: React.ComponentType<DndProviderProps>;

  export function useDrag<T, R = any, CollectedProps = any>(
    spec: {
      type: string | symbol;
      item: T;
      collect?: (monitor: any) => CollectedProps;
    }
  ): [CollectedProps, any];

  export function useDrop<T, R = any, CollectedProps = any>(
    spec: {
      accept: string | symbol;
      drop?: (item: T, monitor: any) => R;
      collect?: (monitor: any) => CollectedProps;
      canDrop?: (item: T) => boolean;
    }
  ): [CollectedProps, any];

  export interface DragSourceMonitor {
    isDragging(): boolean;
    getItem(): any;
    getClientOffset(): { x: number; y: number } | null;
    getDifferenceFromInitialOffset(): { x: number; y: number } | null;
  }

  export interface DropTargetMonitor {
    isOver(): boolean;
    canDrop(): boolean;
    getItem<T>(): T;
  }
}