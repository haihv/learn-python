"use client";
import { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { indentUnit } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";

type PythonEditorProps = {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  onCmdEnter?: () => void;
  height?: string;
  onFullscreen?: () => void;
};

export default function PythonEditor({ value, onChange, readOnly, onCmdEnter, height = "400px", onFullscreen }: PythonEditorProps) {
  const onCmdEnterRef = useRef(onCmdEnter);
  // Keep the ref in sync after every render so the keydown handler always calls
  // the latest version without needing to be re-registered.
  useLayoutEffect(() => {
    onCmdEnterRef.current = onCmdEnter;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Capture phase fires on the way DOWN the DOM tree, before CodeMirror's
    // contentDOM listener. stopPropagation() keeps CodeMirror from ever seeing
    // the event, so no newline is inserted.
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && onCmdEnterRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onCmdEnterRef.current();
      }
    };

    container.addEventListener("keydown", handler, { capture: true });
    return () => container.removeEventListener("keydown", handler, { capture: true });
  }, []); // stable — callback is always current via the ref

  const extensions = useMemo(() => [
    python(),
    EditorState.tabSize.of(4),
    indentUnit.of("    "),
    keymap.of([indentWithTab]),
  ], []);

  return (
    <div ref={containerRef} className="rounded-lg overflow-hidden border border-navy-600 relative">
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="absolute top-1.5 right-1.5 z-10 text-slate-500 hover:text-slate-200 bg-navy-900/80 hover:bg-navy-800 rounded px-1.5 py-0.5 text-xs leading-none cursor-pointer"
          title="Open fullscreen (Esc to close)"
        >
          ⛶
        </button>
      )}
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={oneDark}
        height={height}
        className="font-mono"
        basicSetup={{ lineNumbers: true }}
        editable={!readOnly}
      />
    </div>
  );
}
