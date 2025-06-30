import { JsonNode } from '../../types/core';

export class FileHandler {
  async openFile(): Promise<string> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    return new Promise<string>((resolve, reject) => {
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return reject('No file');
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      };
      input.click();
    });
  }

  saveFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  exportFile(nodes: JsonNode[], format: string): string {
    // simple JSON export for now
    return JSON.stringify(nodes, null, 2);
  }
}
