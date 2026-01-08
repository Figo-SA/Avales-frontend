"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, X, Loader2 } from "lucide-react";
import {
  listDeportistas,
  type ListDeportistasOptions,
} from "@/lib/api/deportistas";
import { listEntrenadores, type ListEntrenadoresOptions } from "@/lib/api/user";
import type { Deportista } from "@/types/deportista";
import type { User } from "@/types/user";
import type { Aval } from "@/types/aval";
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
  aval: Aval;
  onComplete: (data: Partial<FormData>) => void;
  onBack: () => void;
};

type SelectedDeportista = Deportista;
type SelectedEntrenador = User;

export default function Step01Deportistas({
  formData,
  aval,
  onComplete,
  onBack,
}: Step01DeportistasProps) {
  const evento = aval.evento;

  // State for deportistas hombres
  const [searchDeportistasHombres, setSearchDeportistasHombres] = useState("");
  const [deportistasHombres, setDeportistasHombres] = useState<Deportista[]>(
    []
  );
  const [loadingDeportistasHombres, setLoadingDeportistasHombres] =
    useState(false);
  const [showSearchDeportistasHombres, setShowSearchDeportistasHombres] =
    useState(false);
  const [selectedDeportistasHombres, setSelectedDeportistasHombres] = useState<
    SelectedDeportista[]
  >([]);

  // State for deportistas mujeres
  const [searchDeportistasMujeres, setSearchDeportistasMujeres] = useState("");
  const [deportistasMujeres, setDeportistasMujeres] = useState<Deportista[]>(
    []
  );
  const [loadingDeportistasMujeres, setLoadingDeportistasMujeres] =
    useState(false);
  const [showSearchDeportistasMujeres, setShowSearchDeportistasMujeres] =
    useState(false);
  const [selectedDeportistasMujeres, setSelectedDeportistasMujeres] = useState<
    SelectedDeportista[]
  >([]);

  // State for entrenadores hombres
  const [searchEntrenadoresHombres, setSearchEntrenadoresHombres] =
    useState("");
  const [entrenadoresHombres, setEntrenadoresHombres] = useState<User[]>([]);
  const [loadingEntrenadoresHombres, setLoadingEntrenadoresHombres] =
    useState(false);
  const [showSearchEntrenadoresHombres, setShowSearchEntrenadoresHombres] =
    useState(false);
  const [selectedEntrenadoresHombres, setSelectedEntrenadoresHombres] =
    useState<SelectedEntrenador[]>([]);

  // State for entrenadores mujeres
  const [searchEntrenadoresMujeres, setSearchEntrenadoresMujeres] =
    useState("");
  const [entrenadoresMujeres, setEntrenadoresMujeres] = useState<User[]>([]);
  const [loadingEntrenadoresMujeres, setLoadingEntrenadoresMujeres] =
    useState(false);
  const [showSearchEntrenadoresMujeres, setShowSearchEntrenadoresMujeres] =
    useState(false);
  const [selectedEntrenadoresMujeres, setSelectedEntrenadoresMujeres] =
    useState<SelectedEntrenador[]>([]);

  const [error, setError] = useState<string | null>(null);

  // Fetch deportistas hombres
  const fetchDeportistasHombres = useCallback(async () => {
    if (!searchDeportistasHombres.trim()) {
      setDeportistasHombres([]);
      return;
    }

    try {
      setLoadingDeportistasHombres(true);
      const options: ListDeportistasOptions = {
        query: searchDeportistasHombres.trim(),
        limit: 20,
        soloAfiliados: true,
        genero: "Masculino",
      };

      const res = await listDeportistas(options);
      const items = res.data ?? [];
      setDeportistasHombres(items);
    } catch (err: any) {
      console.error("Error al cargar deportistas hombres:", err);
    } finally {
      setLoadingDeportistasHombres(false);
    }
  }, [searchDeportistasHombres]);

  // Fetch deportistas mujeres
  const fetchDeportistasMujeres = useCallback(async () => {
    if (!searchDeportistasMujeres.trim()) {
      setDeportistasMujeres([]);
      return;
    }

    try {
      setLoadingDeportistasMujeres(true);
      const options: ListDeportistasOptions = {
        query: searchDeportistasMujeres.trim(),
        limit: 20,
        soloAfiliados: true,
        genero: "F",
      };

      const res = await listDeportistas(options);
      const items = res.data ?? [];
      setDeportistasMujeres(items);
    } catch (err: any) {
      console.error("Error al cargar deportistas mujeres:", err);
    } finally {
      setLoadingDeportistasMujeres(false);
    }
  }, [searchDeportistasMujeres]);

  // Fetch entrenadores hombres
  const fetchEntrenadoresHombres = useCallback(async () => {
    try {
      setLoadingEntrenadoresHombres(true);
      const options: ListEntrenadoresOptions = {
        limit: 50,
        genero: "MASCULINO",
      };

      const res = await listEntrenadores(options);
      const items = res.data ?? [];

      // Filter by search if there's a search term
      const filtered = searchEntrenadoresHombres.trim()
        ? items.filter((e) =>
            `${e.nombre} ${e.apellido} ${e.cedula}`
              .toLowerCase()
              .includes(searchEntrenadoresHombres.toLowerCase())
          )
        : items;

      setEntrenadoresHombres(filtered);
    } catch (err: any) {
      console.error("Error al cargar entrenadores hombres:", err);
    } finally {
      setLoadingEntrenadoresHombres(false);
    }
  }, [searchEntrenadoresHombres]);

  // Fetch entrenadores mujeres
  const fetchEntrenadoresMujeres = useCallback(async () => {
    try {
      setLoadingEntrenadoresMujeres(true);
      const options: ListEntrenadoresOptions = {
        limit: 50,
        genero: "FEMENINO",
      };

      const res = await listEntrenadores(options);
      const items = res.data ?? [];

      // Filter by search if there's a search term
      const filtered = searchEntrenadoresMujeres.trim()
        ? items.filter((e) =>
            `${e.nombre} ${e.apellido} ${e.cedula}`
              .toLowerCase()
              .includes(searchEntrenadoresMujeres.toLowerCase())
          )
        : items;

      setEntrenadoresMujeres(filtered);
    } catch (err: any) {
      console.error("Error al cargar entrenadores mujeres:", err);
    } finally {
      setLoadingEntrenadoresMujeres(false);
    }
  }, [searchEntrenadoresMujeres]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchDeportistasHombres();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDeportistasHombres]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchDeportistasMujeres();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDeportistasMujeres]);

  useEffect(() => {
    if (!showSearchEntrenadoresHombres) return;
    const timer = setTimeout(() => {
      void fetchEntrenadoresHombres();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEntrenadoresHombres, showSearchEntrenadoresHombres]);

  useEffect(() => {
    if (!showSearchEntrenadoresMujeres) return;
    const timer = setTimeout(() => {
      void fetchEntrenadoresMujeres();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEntrenadoresMujeres, showSearchEntrenadoresMujeres]);

  // Handlers for deportistas hombres
  const handleAddDeportistaHombre = (deportista: Deportista) => {
    const alreadySelected = selectedDeportistasHombres.some(
      (d) => d.id === deportista.id
    );
    if (alreadySelected) return;

    setSelectedDeportistasHombres([...selectedDeportistasHombres, deportista]);
    setSearchDeportistasHombres("");
    setDeportistasHombres([]);
    setShowSearchDeportistasHombres(false);
  };

  const handleRemoveDeportistaHombre = (deportistaId: number) => {
    setSelectedDeportistasHombres(
      selectedDeportistasHombres.filter((d) => d.id !== deportistaId)
    );
  };

  // Handlers for deportistas mujeres
  const handleAddDeportistaMujer = (deportista: Deportista) => {
    const alreadySelected = selectedDeportistasMujeres.some(
      (d) => d.id === deportista.id
    );
    if (alreadySelected) return;

    setSelectedDeportistasMujeres([...selectedDeportistasMujeres, deportista]);
    setSearchDeportistasMujeres("");
    setDeportistasMujeres([]);
    setShowSearchDeportistasMujeres(false);
  };

  const handleRemoveDeportistaMujer = (deportistaId: number) => {
    setSelectedDeportistasMujeres(
      selectedDeportistasMujeres.filter((d) => d.id !== deportistaId)
    );
  };

  // Handlers for entrenadores hombres
  const handleAddEntrenadorHombre = (entrenador: User) => {
    const alreadySelected = selectedEntrenadoresHombres.some(
      (e) => e.id === entrenador.id
    );
    if (alreadySelected) return;

    setSelectedEntrenadoresHombres([
      ...selectedEntrenadoresHombres,
      entrenador,
    ]);
    setSearchEntrenadoresHombres("");
    setEntrenadoresHombres([]);
    setShowSearchEntrenadoresHombres(false);
  };

  const handleRemoveEntrenadorHombre = (entrenadorId: number) => {
    setSelectedEntrenadoresHombres(
      selectedEntrenadoresHombres.filter((e) => e.id !== entrenadorId)
    );
  };

  // Handlers for entrenadores mujeres
  const handleAddEntrenadoraMujer = (entrenador: User) => {
    const alreadySelected = selectedEntrenadoresMujeres.some(
      (e) => e.id === entrenador.id
    );
    if (alreadySelected) return;

    setSelectedEntrenadoresMujeres([
      ...selectedEntrenadoresMujeres,
      entrenador,
    ]);
    setSearchEntrenadoresMujeres("");
    setEntrenadoresMujeres([]);
    setShowSearchEntrenadoresMujeres(false);
  };

  const handleRemoveEntrenadoraMujer = (entrenadorId: number) => {
    setSelectedEntrenadoresMujeres(
      selectedEntrenadoresMujeres.filter((e) => e.id !== entrenadorId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (selectedDeportistasHombres.length !== evento.numAtletasHombres) {
      setError(
        `Debes seleccionar exactamente ${evento.numAtletasHombres} ${
          evento.numAtletasHombres === 1
            ? "deportista hombre"
            : "deportistas hombres"
        } según los requisitos del evento`
      );
      return;
    }

    if (selectedDeportistasMujeres.length !== evento.numAtletasMujeres) {
      setError(
        `Debes seleccionar exactamente ${evento.numAtletasMujeres} ${
          evento.numAtletasMujeres === 1
            ? "deportista mujer"
            : "deportistas mujeres"
        } según los requisitos del evento`
      );
      return;
    }

    if (selectedEntrenadoresHombres.length !== evento.numEntrenadoresHombres) {
      setError(
        `Debes seleccionar exactamente ${evento.numEntrenadoresHombres} ${
          evento.numEntrenadoresHombres === 1 ? "entrenador" : "entrenadores"
        } hombres según los requisitos del evento`
      );
      return;
    }

    if (selectedEntrenadoresMujeres.length !== evento.numEntrenadoresMujeres) {
      setError(
        `Debes seleccionar exactamente ${evento.numEntrenadoresMujeres} ${
          evento.numEntrenadoresMujeres === 1 ? "entrenadora" : "entrenadoras"
        } mujeres según los requisitos del evento`
      );
      return;
    }

    const allDeportistas = [
      ...selectedDeportistasHombres,
      ...selectedDeportistasMujeres,
    ];
    const allEntrenadores = [
      ...selectedEntrenadoresHombres,
      ...selectedEntrenadoresMujeres,
    ];

    const deportistasData = allDeportistas.map((d) => ({
      id: d.id,
      nombre: `${d.nombres} ${d.apellidos}`,
    }));

    const entrenadoresData = allEntrenadores.map((e) => ({
      id: e.id,
      nombre: `${e.nombre} ${e.apellido}`,
    }));

    onComplete({
      deportistas: deportistasData,
      entrenadores: entrenadoresData,
    });
  };

  // Helper component for rendering search section
  const renderDeportistaSearch = (
    genero: "Masculino" | "Femenino",
    search: string,
    setSearch: (value: string) => void,
    deportistas: Deportista[],
    loading: boolean,
    showSearch: boolean,
    setShowSearch: (value: boolean) => void,
    setDeportistas: (value: Deportista[]) => void,
    selected: SelectedDeportista[],
    required: number,
    handleAdd: (d: Deportista) => void,
    handleRemove: (id: number) => void
  ) => {
    const label =
      genero === "Masculino" ? "Deportistas hombres" : "Deportistas mujeres";
    const placeholder =
      genero === "Masculino"
        ? "Buscar deportista hombre..."
        : "Buscar deportista mujer...";
    const addButtonText =
      genero === "Masculino"
        ? "Buscar y agregar deportista hombre"
        : "Buscar y agregar deportista mujer";

    if (required === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{label}:</span> Este evento no
            requiere {label.toLowerCase()} para esta delegación.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <span
            className={`text-sm font-medium ${
              selected.length === required
                ? "text-emerald-600 dark:text-emerald-400"
                : selected.length > required
                ? "text-rose-600 dark:text-rose-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {selected.length} / {required}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          El evento requiere {required}{" "}
          {required === 1
            ? label.toLowerCase().slice(0, -1)
            : label.toLowerCase()}
        </p>

        {!showSearch ? (
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            disabled={selected.length >= required}
            className={`w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-sm font-medium p-4 rounded-lg border-2 border-dashed transition ${
              selected.length >= required
                ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                : "text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
            }`}
          >
            <Plus className="w-5 h-5" />
            {selected.length >= required ? "Límite alcanzado" : addButtonText}
          </button>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="form-input w-full pl-10 pr-10"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearch("");
                setDeportistas([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            {(loading || search.trim() !== "") && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {loading ? (
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
                    const alreadySelected = selected.some(
                      (d) => d.id === deportista.id
                    );
                    const limitReached = selected.length >= required;
                    const isDisabled = alreadySelected || limitReached;

                    return (
                      <button
                        key={deportista.id}
                        type="button"
                        onClick={() => handleAdd(deportista)}
                        disabled={isDisabled}
                        className={`w-full px-4 py-3 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
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

        {selected.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="space-y-2">
              {selected.map((deportista) => (
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
                    onClick={() => handleRemove(deportista.id)}
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
    );
  };

  // Helper component for rendering entrenador search section
  const renderEntrenadorSearch = (
    genero: "Masculino" | "Femenino",
    search: string,
    setSearch: (value: string) => void,
    entrenadores: User[],
    loading: boolean,
    showSearch: boolean,
    setShowSearch: (value: boolean) => void,
    setEntrenadores: (value: User[]) => void,
    selected: SelectedEntrenador[],
    required: number,
    handleAdd: (e: User) => void,
    handleRemove: (id: number) => void
  ) => {
    const label =
      genero === "Masculino" ? "Entrenadores hombres" : "Entrenadoras mujeres";
    const placeholder =
      genero === "Masculino" ? "Buscar entrenador..." : "Buscar entrenadora...";
    const addButtonText =
      genero === "Masculino"
        ? "Buscar y agregar entrenador"
        : "Buscar y agregar entrenadora";

    if (required === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{label}:</span> Este evento no
            requiere {label.toLowerCase()} para esta delegación.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <span
            className={`text-sm font-medium ${
              selected.length === required
                ? "text-emerald-600 dark:text-emerald-400"
                : selected.length > required
                ? "text-rose-600 dark:text-rose-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {selected.length} / {required}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          El evento requiere {required}{" "}
          {required === 1
            ? label.toLowerCase().slice(0, -1)
            : label.toLowerCase()}
        </p>

        {!showSearch ? (
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            disabled={selected.length >= required}
            className={`w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-sm font-medium p-4 rounded-lg border-2 border-dashed transition ${
              selected.length >= required
                ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                : "text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
            }`}
          >
            <Plus className="w-5 h-5" />
            {selected.length >= required ? "Límite alcanzado" : addButtonText}
          </button>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="form-input w-full pl-10 pr-10"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearch("");
                setEntrenadores([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            {showSearch && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Cargando entrenadores...
                  </div>
                ) : entrenadores.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No se encontraron entrenadores
                  </div>
                ) : (
                  entrenadores.map((entrenador) => {
                    const alreadySelected = selected.some(
                      (e) => e.id === entrenador.id
                    );
                    const limitReached = selected.length >= required;
                    const isDisabled = alreadySelected || limitReached;

                    return (
                      <button
                        key={entrenador.id}
                        type="button"
                        onClick={() => handleAdd(entrenador)}
                        disabled={isDisabled}
                        className={`w-full px-4 py-3 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {entrenador.nombre} {entrenador.apellido}
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

        {selected.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="space-y-2">
              {selected.map((entrenador) => (
                <div
                  key={entrenador.id}
                  className="flex items-start gap-3 bg-white dark:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">
                      {entrenador.nombre} {entrenador.apellido}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {entrenador.cedula}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(entrenador.id)}
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
    );
  };

  return (
    <div>
      <h1 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-2">
        Selecciona los participantes
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Agrega los deportistas y entrenadores que participarán en el evento
        según los requisitos establecidos.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deportistas Hombres Section */}
        {renderDeportistaSearch(
          "Masculino",
          searchDeportistasHombres,
          setSearchDeportistasHombres,
          deportistasHombres,
          loadingDeportistasHombres,
          showSearchDeportistasHombres,
          setShowSearchDeportistasHombres,
          setDeportistasHombres,
          selectedDeportistasHombres,
          evento.numAtletasHombres,
          handleAddDeportistaHombre,
          handleRemoveDeportistaHombre
        )}

        {/* Deportistas Mujeres Section */}
        {renderDeportistaSearch(
          "Femenino",
          searchDeportistasMujeres,
          setSearchDeportistasMujeres,
          deportistasMujeres,
          loadingDeportistasMujeres,
          showSearchDeportistasMujeres,
          setShowSearchDeportistasMujeres,
          setDeportistasMujeres,
          selectedDeportistasMujeres,
          evento.numAtletasMujeres,
          handleAddDeportistaMujer,
          handleRemoveDeportistaMujer
        )}

        {/* Entrenadores Hombres Section */}
        {renderEntrenadorSearch(
          "Masculino",
          searchEntrenadoresHombres,
          setSearchEntrenadoresHombres,
          entrenadoresHombres,
          loadingEntrenadoresHombres,
          showSearchEntrenadoresHombres,
          setShowSearchEntrenadoresHombres,
          setEntrenadoresHombres,
          selectedEntrenadoresHombres,
          evento.numEntrenadoresHombres,
          handleAddEntrenadorHombre,
          handleRemoveEntrenadorHombre
        )}

        {/* Entrenadores Mujeres Section */}
        {renderEntrenadorSearch(
          "Femenino",
          searchEntrenadoresMujeres,
          setSearchEntrenadoresMujeres,
          entrenadoresMujeres,
          loadingEntrenadoresMujeres,
          showSearchEntrenadoresMujeres,
          setShowSearchEntrenadoresMujeres,
          setEntrenadoresMujeres,
          selectedEntrenadoresMujeres,
          evento.numEntrenadoresMujeres,
          handleAddEntrenadoraMujer,
          handleRemoveEntrenadoraMujer
        )}

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
