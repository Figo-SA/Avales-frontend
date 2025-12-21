"use client";

import { useState, useEffect } from "react";
import { Check, Search, X } from "lucide-react";
import type { DeportistaListItem } from "@/types/deportista";
import { listDeportistas } from "@/lib/api/deportista";

type Props = {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
};

export default function DeportistasSelector({
  selectedIds,
  onChange,
  disabled = false,
}: Props) {
  const [deportistas, setDeportistas] = useState<DeportistaListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await listDeportistas({ limit: 100 });
        // res.data es directamente el array de deportistas
        setDeportistas(res.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Error cargando deportistas");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredDeportistas = deportistas.filter((d) => {
    const fullName = `${d.nombres ?? ""} ${d.apellidos ?? ""} ${d.cedula}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const toggleDeportista = (id: number) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedDeportistas = deportistas.filter((d) =>
    selectedIds.includes(d.id)
  );

  if (loading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Cargando deportistas...
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Deportistas seleccionados */}
      {selectedDeportistas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDeportistas.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full text-sm"
            >
              {d.nombres} {d.apellidos}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => toggleDeportista(d.id)}
                  className="hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar deportista..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
          className="form-input w-full pl-9"
        />
      </div>

      {/* Lista de deportistas */}
      <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        {filteredDeportistas.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No se encontraron deportistas
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDeportistas.map((d) => {
              const isSelected = selectedIds.includes(d.id);
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => toggleDeportista(d.id)}
                    disabled={disabled}
                    className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""
                    } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {d.nombres} {d.apellidos}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        CI: {d.cedula}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-violet-500" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {selectedIds.length} deportista{selectedIds.length !== 1 ? "s" : ""}{" "}
        seleccionado{selectedIds.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
