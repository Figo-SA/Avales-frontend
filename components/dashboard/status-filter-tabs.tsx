"use client";

import type { AvalStatusV2 } from "./aval-status-badge-v2";

type StatusOption = {
  value: AvalStatusV2 | "TODOS";
  label: string;
  count?: number;
};

type Props = {
  options: StatusOption[];
  selected: AvalStatusV2 | "TODOS";
  onChange: (value: AvalStatusV2 | "TODOS") => void;
};

const STATUS_COLORS: Record<AvalStatusV2 | "TODOS", { active: string; inactive: string; count: string }> = {
  TODOS: {
    active: "border-indigo-500 text-indigo-600 dark:text-indigo-400",
    inactive: "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300",
    count: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
  },
  EN_PROCESO: {
    active: "border-amber-500 text-amber-600 dark:text-amber-400",
    inactive: "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300",
    count: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  },
  APROBADO: {
    active: "border-emerald-500 text-emerald-600 dark:text-emerald-400",
    inactive: "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300",
    count: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  },
  RECHAZADO: {
    active: "border-rose-500 text-rose-600 dark:text-rose-400",
    inactive: "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300",
    count: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
  },
  ACTIVO: {
    active: "border-indigo-500 text-indigo-600 dark:text-indigo-400",
    inactive: "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300",
    count: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
  },
};

export default function StatusFilterTabs({ options, selected, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-px -mb-px">
      {options.map((option) => {
        const isActive = selected === option.value;
        const colors = STATUS_COLORS[option.value];

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
              isActive ? colors.active : colors.inactive
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? colors.count : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
