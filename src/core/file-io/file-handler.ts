import { JsonNode } from '../../types/core';
import { JsonParser } from '../parser/json-parser';

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

  async openJson(): Promise<JsonNode[]> {
    const text = await this.openFile();
    const parser = new JsonParser();
    return parser.parse(text);
  }

  saveFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  saveJson(nodes: JsonNode[], filename: string): void {
    const parser = new JsonParser();
    const content = parser.serialize(nodes);
    this.saveFile(content, filename);
  }

  exportFile(nodes: JsonNode[], format: string): string {
    const parser = new JsonParser();
    return parser.serialize(nodes);
  }
}
