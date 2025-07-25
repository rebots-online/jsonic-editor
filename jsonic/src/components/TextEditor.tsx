import React, { useEffect, useRef } from 'react';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onOpen: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  content, 
  onChange,
  onSave,
  onOpen
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            onSave();
            break;
          case 'o':
            event.preventDefault();
            onOpen();
            break;
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      return () => {
        textarea.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [onSave, onOpen]);

  return (
    <div className="text-editor">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          border: 'none',
          fontFamily: 'monospace',
          fontSize: '14px',
          padding: '16px',
          resize: 'none',
          outline: 'none'
        }}
        spellCheck={false}
      />
    </div>
  );
};

export default TextEditor;