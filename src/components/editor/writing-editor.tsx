"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback, useRef, type ReactNode } from "react";
import { Bold, Italic, Heading2, Undo, Redo } from "lucide-react";

type WritingEditorProps = {
  content: string;
  onUpdate: (html: string) => void;
  placeholder?: string;
};

export function WritingEditor({ content, onUpdate, placeholder }: WritingEditorProps) {
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing, or use the AI assistant on the right...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-invert max-w-none px-4 py-3 text-base leading-8 focus:outline-none min-h-[400px]",
      },
    },
    onUpdate: ({ editor }) => {
      onUpdateRef.current(editor.getHTML());
    },
  });

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const appendText = useCallback(
    (text: string) => {
      if (!editor) return;
      editor.commands.focus("end");
      editor.commands.insertContent(`<p>${text}</p>`);
    },
    [editor]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__editorAppend = appendText;
    }
  }, [appendText]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex items-center gap-1 border-b border-border bg-surface-2 px-3 py-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={14} />
        </ToolbarButton>
        <div className="mx-2 h-4 w-px bg-border" />
        <ToolbarButton active={false} onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton active={false} onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={14} />
        </ToolbarButton>
        <div className="ml-auto text-xs text-muted">
          {editor.storage.characterCount?.characters?.() ?? editor.getText().length} chars
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded p-1.5 transition ${
        active ? "bg-accent/20 text-accent" : "text-muted hover:text-foreground hover:bg-surface"
      }`}
    >
      {children}
    </button>
  );
}
