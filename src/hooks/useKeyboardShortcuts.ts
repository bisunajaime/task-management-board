import { useEffect } from 'react';

type ShortcutHandlers = Record<string, () => void>;

const FOCUS_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON']);

export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditing =
        FOCUS_TAGS.has(target.tagName) ||
        target.isContentEditable ||
        target.closest('[data-tiptap-editor]') !== null;

      // Allow Escape even while editing
      if (e.key === 'Escape') {
        handlers['Escape']?.();
        return;
      }

      if (isEditing) return;

      const handler = handlers[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}
