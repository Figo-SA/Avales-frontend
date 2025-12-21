"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  X,
  FileText,
} from "lucide-react";

import { useAuth } from "@/app/providers/auth-provider";
import ViewToggle, { type ViewMode } from "@/components/dashboard/view-toggle";
import StatusFilterTabs from "@/components/dashboard/status-filter-tabs";
import DisciplineFilter from "@/components/dashboard/discipline-filter";
import AvalListItem, { type AvalListItemData } from "@/components/dashboard/aval-list-item";
import AvalCardV2, { type AvalCardData } from "@/components/dashboard/aval-card-v2";
import type { AvalStatusV2 } from "@/components/dashboard/aval-status-badge-v2";
import { listEventos } from "@/lib/api/evento";
import type { Evento, EventoStatus } from "@/types/evento";

type AvalData = AvalListItemData & AvalCardData;

// Map backend EventoStatus to frontend AvalStatusV2
function mapEventoStatusToAvalStatus(status: EventoStatus): AvalStatusV2 {
  switch (status) {
    case "DISPONIBLE":
    case "SOLICITADO":
      return "EN_PROCESO";
    case "ACEPTADO":
      return "APROBADO";
    case "RECHAZADO":
      return "RECHAZADO";
    default:
      return "EN_PROCESO";
  }
}

// Transform Evento to AvalData format
function eventoToAvalData(evento: Evento): AvalData {
  return {
    id: evento.id,
    codigo: evento.codigo,
    tipo: `${evento.tipoEvento} - ${evento.tipoParticipacion}`,
    disciplina: evento.disciplina?.nombre ?? "Sin disciplina",
    rol: evento.tipoEvento,
    fecha: evento.fechaInicio,
    estado: mapEventoStatusToAvalStatus(evento.estado),
    descripcion: evento.nombre,
  };
}

type SortOption = "recientes" | "antiguos" | "codigo";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError } = useAuth();

  // Data state
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [eventosError, setEventosError] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<AvalStatusV2 | "TODOS">("TODOS");
  const [selectedDisciplines, setSelectedDisciplines] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recientes");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Check if user is an ENTRENADOR
  const isEntrenador = user?.roles?.includes("ENTRENADOR") ?? false;

  // Load eventos from API
  const loadEventos = useCallback(async () => {
    if (authLoading || !user) return;

    try {
      setLoadingEventos(true);
      setEventosError(null);

      // For trainers, filter by their discipline
      const disciplinaId = isEntrenador ? user.disciplina?.id : undefined;

      const res = await listEventos({ disciplinaId, limit: 100 });
      // res.data es directamente el array de eventos
      setEventos(res.data ?? []);
    } catch (err: any) {
      console.error("Error loading eventos:", err);
      setEventosError(err?.message ?? "Error al cargar eventos");
    } finally {
      setLoadingEventos(false);
    }
  }, [authLoading, user, isEntrenador]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/signin");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    void loadEventos();
  }, [loadEventos]);

  // Convert eventos to avales format
  const avales = useMemo(() => eventos.map(eventoToAvalData), [eventos]);

  // Get unique disciplines from loaded events
  const disciplines = useMemo(() => {
    const disciplineMap = new Map<number, string>();
    eventos.forEach((e) => {
      if (e.disciplina?.id && e.disciplina?.nombre) {
        disciplineMap.set(e.disciplina.id, e.disciplina.nombre);
      }
    });
    return Array.from(disciplineMap.entries()).map(([id, nombre]) => ({ id, nombre }));
  }, [eventos]);

  // Filter and sort avales
  const filteredAvales = useMemo(() => {
    let result = [...avales];

    // Filter by status
    if (statusFilter !== "TODOS") {
      result = result.filter((a) => a.estado === statusFilter);
    }

    // Filter by discipline (only for non-trainers, trainers are already filtered by API)
    if (!isEntrenador && selectedDisciplines.length > 0) {
      const disciplineNames = disciplines
        .filter((d) => selectedDisciplines.includes(d.id))
        .map((d) => d.nombre);
      result = result.filter((a) => disciplineNames.includes(a.disciplina));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.codigo.toLowerCase().includes(query) ||
          a.disciplina.toLowerCase().includes(query) ||
          a.rol?.toLowerCase().includes(query) ||
          a.descripcion?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "recientes":
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case "antiguos":
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        case "codigo":
          return a.codigo.localeCompare(b.codigo);
        default:
          return 0;
      }
    });

    return result;
  }, [avales, statusFilter, selectedDisciplines, searchQuery, sortBy, disciplines, isEntrenador]);

  // Count by status
  const statusCounts = useMemo(() => {
    return {
      TODOS: avales.length,
      EN_PROCESO: avales.filter((a) => a.estado === "EN_PROCESO").length,
      APROBADO: avales.filter((a) => a.estado === "APROBADO").length,
      RECHAZADO: avales.filter((a) => a.estado === "RECHAZADO").length,
      ACTIVO: avales.filter((a) => a.estado === "ACTIVO").length,
    };
  }, [avales]);

  const statusOptions = [
    { value: "TODOS" as const, label: "Todos", count: statusCounts.TODOS },
    { value: "EN_PROCESO" as const, label: "En Proceso", count: statusCounts.EN_PROCESO },
    { value: "APROBADO" as const, label: "Aprobados", count: statusCounts.APROBADO },
    { value: "RECHAZADO" as const, label: "Rechazados", count: statusCounts.RECHAZADO },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recientes", label: "Más recientes" },
    { value: "antiguos", label: "Más antiguos" },
    { value: "codigo", label: "Por código" },
  ];

  const activeFiltersCount =
    selectedDisciplines.length + (searchQuery ? 1 : 0);

  if (authLoading || loadingEventos) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">
            {authLoading ? "Cargando tu sesión..." : "Cargando eventos..."}
          </p>
        </div>
      </div>
    );
  }

  if (authError || eventosError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-rose-600">
            {authError ?? eventosError}
          </p>
          <button
            type="button"
            onClick={() => void loadEventos()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Dashboard de Avales
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isEntrenador && user.disciplina?.nombre
                ? `Eventos de ${user.disciplina.nombre}`
                : "Gestiona y revisa todos los avales deportivos"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user.roles?.[0] ?? "Usuario"}
              </span>
            </div>

            {/* New Aval Button */}
            <button
              type="button"
              onClick={() => router.push("/mis-avales/nuevo")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Aval</span>
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-slate-200 dark:border-slate-700">
            {/* Status Tabs */}
            <div className="px-4 sm:px-6">
              <StatusFilterTabs
                options={statusOptions}
                selected={statusFilter}
                onChange={setStatusFilter}
              />
            </div>

            {/* Search and Actions Bar */}
            <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por número de aval..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Filters Toggle - Only show for non-trainers */}
                {!isEntrenador && (
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      showFilters || activeFiltersCount > 0
                        ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                        : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center bg-indigo-500 text-white text-xs rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {sortOptions.find((o) => o.value === sortBy)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showSortMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowSortMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 py-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSortBy(option.value);
                              setShowSortMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${
                              sortBy === option.value
                                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* View Toggle */}
                <ViewToggle mode={viewMode} onChange={setViewMode} />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex">
            {/* Sidebar Filters - Only for non-trainers */}
            {showFilters && !isEntrenador && (
              <div className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/50">
                <DisciplineFilter
                  disciplines={disciplines}
                  selected={selectedDisciplines}
                  onChange={setSelectedDisciplines}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6">
              {filteredAvales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No se encontraron avales
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                    {isEntrenador
                      ? "No hay eventos disponibles para tu disciplina."
                      : "No hay avales que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda."}
                  </p>
                </div>
              ) : viewMode === "list" ? (
                /* List View */
                <div className="space-y-3">
                  {filteredAvales.map((aval) => (
                    <AvalListItem
                      key={aval.id}
                      aval={aval}
                      href={`/mis-avales/${aval.id}`}
                    />
                  ))}
                </div>
              ) : (
                /* Cards View */
                <div>
                  {/* En Proceso Section */}
                  {filteredAvales.some((a) => a.estado === "EN_PROCESO") && (
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Avales en Proceso
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredAvales
                          .filter((a) => a.estado === "EN_PROCESO")
                          .map((aval) => (
                            <AvalCardV2
                              key={aval.id}
                              aval={aval}
                              href={`/mis-avales/${aval.id}`}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Historial Section */}
                  {filteredAvales.some(
                    (a) => a.estado === "APROBADO" || a.estado === "RECHAZADO"
                  ) && (
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        Historial de Avales
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredAvales
                          .filter(
                            (a) =>
                              a.estado === "APROBADO" || a.estado === "RECHAZADO"
                          )
                          .map((aval) => (
                            <AvalCardV2
                              key={aval.id}
                              aval={aval}
                              href={`/mis-avales/${aval.id}`}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {filteredAvales.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Mostrando{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {filteredAvales.length}
                </span>{" "}
                de{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {avales.length}
                </span>{" "}
                avales
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
