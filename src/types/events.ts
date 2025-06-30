export interface KeyboardEventType {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export interface MouseEventType {
  x: number;
  y: number;
  button: number;
}

export interface FileEventType {
  filename: string;
  content: string;
}
