import { FileHandler } from '../core/file-io/file-handler';

export function useFileOperations() {
  const handler = new FileHandler();
  return handler;
}
