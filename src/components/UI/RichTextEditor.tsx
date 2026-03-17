import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export const RichTextEditor = ({
  content,
  onChange,
  editable = true,
  placeholder = 'Add a description...',
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: !editable }),
    ],
    content,
    editable,
    onUpdate: ({ editor: e }: { editor: Editor }) => {
      onChange?.(e.getHTML());
    },
  });

  // Sync content when it changes externally (e.g. switching tickets)
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  // Sync editable mode
  useEffect(() => {
    editor?.setEditable(editable);
  }, [editable, editor]);

  return (
    <div
      className={`tiptap-editor ${editable ? 'cursor-text' : 'cursor-default'}`}
      data-tiptap-editor
    >
      {editable && (
        <div className="flex gap-1 mb-2 flex-wrap">
          <ToolbarButton
            active={editor?.isActive('bold') ?? false}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('italic') ?? false}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('bulletList') ?? false}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            •—
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('orderedList') ?? false}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            title="Ordered list"
          >
            1.
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('code') ?? false}
            onClick={() => editor?.chain().focus().toggleCode().run()}
            title="Code"
          >
            {'</>'}
          </ToolbarButton>
        </div>
      )}
      <EditorContent
        editor={editor}
        className={`
          text-sm text-gray-700 dark:text-gray-200 leading-relaxed
          ${editable
            ? 'min-h-[120px] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 transition-colors'
            : 'prose-sm max-w-none'
          }
        `}
      />
    </div>
  );
};

interface ToolbarButtonProps {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton = ({ active, onClick, title, children }: ToolbarButtonProps) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`
      px-2 py-1 text-xs rounded font-medium transition-colors
      ${active
        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }
    `}
  >
    {children}
  </button>
);
