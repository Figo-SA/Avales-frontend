"use client";

import { Check } from "lucide-react";

type Discipline = {
  id: number;
  nombre: string;
};

type Props = {
  disciplines: Discipline[];
  selected: number[];
  onChange: (ids: number[]) => void;
};

export default function DisciplineFilter({ disciplines, selected, onChange }: Props) {
  const toggleDiscipline = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((d) => d !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Disciplina
        </h4>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="space-y-1">
        {disciplines.map((discipline) => {
          const isSelected = selected.includes(discipline.id);
          return (
            <button
              key={discipline.id}
              type="button"
              onClick={() => toggleDiscipline(discipline.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isSelected
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="flex-1 text-left">{discipline.nombre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
