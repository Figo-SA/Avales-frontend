"use client";

import { List, LayoutGrid } from "lucide-react";

export type ViewMode = "list" | "cards";

type Props = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export default function ViewToggle({ mode, onChange }: Props) {
  return (
    <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 ${
          mode === "list"
            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
        title="Vista de lista"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("cards")}
        className={`flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 ${
          mode === "cards"
            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
        title="Vista de tarjetas"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}
