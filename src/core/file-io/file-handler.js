import { GenericParser } from '../parser/generic-parser';
export class FileHandler {
    async openFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.yaml,.yml,.toml,.ini';
        return new Promise((resolve, reject) => {
            input.onchange = () => {
                const file = input.files?.[0];
                if (!file)
                    return reject('No file');
                const reader = new FileReader();
                reader.onload = () => resolve({ name: file.name, content: reader.result });
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            };
            input.click();
        });
    }
    async openDocument() {
        const { name, content } = await this.openFile();
        const parser = new GenericParser();
        const extMatch = /\.([^\.]+)$/.exec(name);
        let ext = extMatch ? extMatch[1].toLowerCase() : 'json';
        const format = ext === 'yaml' || ext === 'yml'
            ? 'yaml'
            : ext;
        return { format, nodes: parser.parse(content, format) };
    }
    saveFile(content, filename, type = 'application/json') {
        const blob = new Blob([content], { type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
    saveDocument(nodes, format, filename) {
        const parser = new GenericParser();
        const content = parser.serialize(nodes, format);
        const mime = format === 'json' ? 'application/json' : 'text/plain';
        this.saveFile(content, filename, mime);
    }
    exportFile(nodes, format) {
        const parser = new GenericParser();
        return parser.serialize(nodes, format);
    }
}
