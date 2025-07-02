import { JsonNode } from '../../types/core';
import { JsonParser } from './json-parser';
import YAML from 'yaml';
import toml from '@iarna/toml';
import { parse as parseIni, stringify as stringifyIni } from 'ini';

export type SupportedFormat = 'json' | 'yaml' | 'toml' | 'ini';

export class GenericParser {
  private json = new JsonParser();

  parse(content: string, format: SupportedFormat): JsonNode[] {
    switch (format) {
      case 'yaml':
        return this.json.parse(JSON.stringify(YAML.parse(content)));
      case 'toml':
        return this.json.parse(JSON.stringify(toml.parse(content)));
      case 'ini':
        return this.json.parse(JSON.stringify(parseIni(content)));
      case 'json':
      default:
        return this.json.parse(content);
    }
  }

  serialize(nodes: JsonNode[], format: SupportedFormat): string {
    const obj = JSON.parse(this.json.serialize(nodes));
    switch (format) {
      case 'yaml':
        return YAML.stringify(obj);
      case 'toml':
        return toml.stringify(obj as any);
      case 'ini':
        return stringifyIni(obj as any);
      case 'json':
      default:
        return JSON.stringify(obj, null, 2);
    }
  }
}
