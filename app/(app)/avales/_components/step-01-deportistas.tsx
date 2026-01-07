"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, X, Loader2 } from "lucide-react";
import {
  listDeportistas,
  type ListDeportistasOptions,
} from "@/lib/api/deportistas";
import { listUsers, type ListUsersOptions } from "@/lib/api/user";
import type { Deportista } from "@/types/deportista";
import type { User } from "@/types/user";
import { formatGenero } from "@/lib/utils/formatters";

type FormData = {
  deportistas: Array<{ id: number; nombre: string }>;
  entrenadores: Array<{ id: number; nombre: string }>;
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  objetivos: string[];
  criterios: string[];
  rubros: Array<{
    rubro: string;
    monto: number;
    observaciones?: string;
  }>;
  observaciones?: string;
};

type Step01DeportistasProps = {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
  onBack: () => void;
};

type SelectedDeportista = Deportista;
type SelectedEntrenador = User;

export default function Step01Deportistas({
  formData,
  onComplete,
  onBack,
}: Step01DeportistasProps) {
  // State for deportistas search
  const [searchDeportistas, setSearchDeportistas] = useState("");
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [loadingDeportistas, setLoadingDeportistas] = useState(false);
  const [showSearchDeportistas, setShowSearchDeportistas] = useState(false);

  // State for entrenadores search
  const [searchEntrenadores, setSearchEntrenadores] = useState("");
  const [entrenadores, setEntrenadores] = useState<User[]>([]);
  const [loadingEntrenadores, setLoadingEntrenadores] = useState(false);
  const [showSearchEntrenadores, setShowSearchEntrenadores] = useState(false);

  // State for selected items
  const [selectedDeportistas, setSelectedDeportistas] = useState<
    SelectedDeportista[]
  >([]);
  const [selectedEntrenadores, setSelectedEntrenadores] = useState<
    SelectedEntrenador[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDeportistas = useCallback(async () => {
    if (!searchDeportistas.trim()) {
      setDeportistas([]);
      return;
    }

    try {
      setLoadingDeportistas(true);
      const options: ListDeportistasOptions = {
        query: searchDeportistas.trim(),
        limit: 20,
        soloAfiliados: true,
      };

      const res = await listDeportistas(options);
      const items = res.data ?? [];
      setDeportistas(items);
    } catch (err: any) {
      console.error("Error al cargar deportistas:", err);
    } finally {
      setLoadingDeportistas(false);
    }
  }, [searchDeportistas]);

  const fetchEntrenadores = useCallback(async () => {
    if (!searchEntrenadores.trim()) {
      setEntrenadores([]);
      return;
    }

    try {
      setLoadingEntrenadores(true);
      const options: ListUsersOptions = {
        query: searchEntrenadores.trim(),
        limit: 20,
        rol: "ENTRENADOR",
      };

      const res = await listUsers(options);
      const items = res.data ?? [];
      setEntrenadores(items);
    } catch (err: any) {
      console.error("Error al cargar entrenadores:", err);
    } finally {
      setLoadingEntrenadores(false);
    }
  }, [searchEntrenadores]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchDeportistas();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDeportistas]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchEntrenadores();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEntrenadores]);

  const handleAddDeportista = (deportista: Deportista) => {
    const alreadySelected = selectedDeportistas.some(
      (d) => d.id === deportista.id
    );

    if (alreadySelected) return;

    setSelectedDeportistas([...selectedDeportistas, deportista]);
    setSearchDeportistas("");
    setDeportistas([]);
    setShowSearchDeportistas(false);
  };

  const handleRemoveDeportista = (deportistaId: number) => {
    setSelectedDeportistas(
      selectedDeportistas.filter((d) => d.id !== deportistaId)
    );
  };

  const handleAddEntrenador = (entrenador: User) => {
    const alreadySelected = selectedEntrenadores.some(
      (e) => e.id === entrenador.id
    );

    if (alreadySelected) return;

    setSelectedEntrenadores([...selectedEntrenadores, entrenador]);
    setSearchEntrenadores("");
    setEntrenadores([]);
    setShowSearchEntrenadores(false);
  };

  const handleRemoveEntrenador = (entrenadorId: number) => {
    setSelectedEntrenadores(
      selectedEntrenadores.filter((e) => e.id !== entrenadorId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDeportistas.length === 0) {
      setError("Debes seleccionar al menos un deportista");
      return;
    }

    if (selectedEntrenadores.length === 0) {
      setError("Debes seleccionar al menos un entrenador");
      return;
    }

    const deportistasData = selectedDeportistas.map((d) => ({
      id: d.id,
      nombre: `${d.nombres} ${d.apellidos}`,
    }));

    const entrenadoresData = selectedEntrenadores.map((e) => ({
      id: e.id,
      nombre: `${e.nombres} ${e.apellidos}`,
    }));

    onComplete({
      deportistas: deportistasData,
      entrenadores: entrenadoresData,
    });
  };

  return (
    <div>
      <h1 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-2">
        Selecciona los participantes
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Agrega los deportistas y entrenadores que participarán en el evento.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deportistas Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deportistas participantes
          </label>

          {!showSearchDeportistas ? (
            <button
              type="button"
              onClick={() => setShowSearchDeportistas(true)}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition"
            >
              <Plus className="w-5 h-5" />
              Buscar y agregar deportista
            </button>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="form-input w-full pl-10 pr-10"
                placeholder="Buscar por nombre, apellido o cédula..."
                value={searchDeportistas}
                onChange={(e) => setSearchDeportistas(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearchDeportistas(false);
                  setSearchDeportistas("");
                  setDeportistas([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Search results dropdown */}
              {(loadingDeportistas || deportistas.length > 0) && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {loadingDeportistas ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Buscando...
                    </div>
                  ) : deportistas.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No se encontraron deportistas
                    </div>
                  ) : (
                    deportistas.map((deportista) => {
                      const alreadySelected = selectedDeportistas.some(
                        (d) => d.id === deportista.id
                      );

                      return (
                        <button
                          key={deportista.id}
                          type="button"
                          onClick={() => handleAddDeportista(deportista)}
                          disabled={alreadySelected}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
                            alreadySelected
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {deportista.nombres} {deportista.apellidos}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {deportista.cedula}
                                </p>
                                {deportista.disciplina?.nombre && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {deportista.disciplina.nombre}
                                  </p>
                                )}
                              </div>
                            </div>
                            {alreadySelected && (
                              <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-2">
                                Agregado
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* Selected deportistas list */}
          {selectedDeportistas.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedDeportistas.length}{" "}
                {selectedDeportistas.length === 1
                  ? "deportista seleccionado"
                  : "deportistas seleccionados"}
              </p>

              <div className="space-y-2">
                {selectedDeportistas.map((deportista) => (
                  <div
                    key={deportista.id}
                    className="flex items-start gap-3 bg-white dark:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">
                        {deportista.nombres} {deportista.apellidos}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{deportista.cedula}</span>
                        {deportista.genero && (
                          <span>{formatGenero(deportista.genero)}</span>
                        )}
                        {deportista.disciplina?.nombre && (
                          <span>{deportista.disciplina.nombre}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDeportista(deportista.id)}
                      className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Entrenadores Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Entrenadores participantes
          </label>

          {!showSearchEntrenadores ? (
            <button
              type="button"
              onClick={() => setShowSearchEntrenadores(true)}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition"
            >
              <Plus className="w-5 h-5" />
              Buscar y agregar entrenador
            </button>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="form-input w-full pl-10 pr-10"
                placeholder="Buscar por nombre, apellido o cédula..."
                value={searchEntrenadores}
                onChange={(e) => setSearchEntrenadores(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearchEntrenadores(false);
                  setSearchEntrenadores("");
                  setEntrenadores([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Search results dropdown */}
              {(loadingEntrenadores || entrenadores.length > 0) && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {loadingEntrenadores ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Buscando...
                    </div>
                  ) : entrenadores.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No se encontraron entrenadores
                    </div>
                  ) : (
                    entrenadores.map((entrenador) => {
                      const alreadySelected = selectedEntrenadores.some(
                        (e) => e.id === entrenador.id
                      );

                      return (
                        <button
                          key={entrenador.id}
                          type="button"
                          onClick={() => handleAddEntrenador(entrenador)}
                          disabled={alreadySelected}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
                            alreadySelected
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {entrenador.nombres} {entrenador.apellidos}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {entrenador.cedula}
                              </p>
                            </div>
                            {alreadySelected && (
                              <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-2">
                                Agregado
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* Selected entrenadores list */}
          {selectedEntrenadores.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedEntrenadores.length}{" "}
                {selectedEntrenadores.length === 1
                  ? "entrenador seleccionado"
                  : "entrenadores seleccionados"}
              </p>

              <div className="space-y-2">
                {selectedEntrenadores.map((entrenador) => (
                  <div
                    key={entrenador.id}
                    className="flex items-start gap-3 bg-white dark:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">
                        {entrenador.nombres} {entrenador.apellidos}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {entrenador.cedula}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveEntrenador(entrenador.id)}
                      className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            ← Cancelar
          </button>
          <button
            type="submit"
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Siguiente paso →
          </button>
        </div>
      </form>
    </div>
  );
}
