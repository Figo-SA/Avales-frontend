"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Download,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { listDeportistas } from "@/lib/api/deportista";
import type { DeportistaListItem } from "@/types/deportista";

type FilterTab = "todos" | "afiliados" | "no_afiliados";

export default function DeportistasPage() {
  const router = useRouter();
  const [deportistas, setDeportistas] = useState<DeportistaListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("todos");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listDeportistas({
          page: currentPage,
          limit: itemsPerPage,
          query: searchQuery || undefined,
        });
        // El backend retorna: { status, message, data: [...], meta: { page, limit, total } }
        setDeportistas(res.data ?? []);
        setTotalItems(res.meta?.total ?? 0);
      } catch (err: any) {
        console.error("Error loading deportistas:", err);
        setError(err?.message ?? "Error al cargar deportistas");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [currentPage, searchQuery]);

  // Filter by tab (client-side filtering since backend only returns afiliados)
  const filteredDeportistas = useMemo(() => {
    switch (activeTab) {
      case "afiliados":
        return deportistas.filter((d) => d.afiliacion);
      case "no_afiliados":
        return deportistas.filter((d) => !d.afiliacion);
      default:
        return deportistas;
    }
  }, [deportistas, activeTab]);

  // Counts for tabs
  const counts = useMemo(() => {
    const afiliados = deportistas.filter((d) => d.afiliacion).length;
    const noAfiliados = deportistas.filter((d) => !d.afiliacion).length;
    return {
      todos: totalItems,
      afiliados,
      noAfiliados,
    };
  }, [deportistas, totalItems]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredDeportistas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDeportistas.map((d) => d.id)));
    }
  };

  const handleSelectOne = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Generate display ID (prefix based on name + sequence)
  const generateDisplayId = (deportista: DeportistaListItem, index: number) => {
    const prefix = deportista.apellidos?.substring(0, 1).toUpperCase() ?? "D";
    return `${prefix}-${String(index + 1).padStart(3, "0")}`;
  };

  // Pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Deportistas
        </h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-48"
            />
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={() => router.push("/mis-deportistas/nuevo")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Deportista
          </button>

          {/* Download PDF */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("todos")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "todos"
              ? "bg-violet-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Todos {counts.todos}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("afiliados")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "afiliados"
              ? "bg-violet-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Afiliados {counts.afiliados}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("no_afiliados")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "no_afiliados"
              ? "bg-violet-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          No afiliados {counts.noAfiliados}
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header Label */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Deportistas
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12 text-red-500">{error}</div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          filteredDeportistas.length > 0 &&
                          selectedIds.size === filteredDeportistas.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cédula
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Apellidos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nombres
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fecha de Nacimiento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Disciplina
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDeportistas.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        No se encontraron deportistas
                      </td>
                    </tr>
                  ) : (
                    filteredDeportistas.map((deportista, index) => (
                      <tr
                        key={deportista.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(deportista.id)}
                            onChange={() => handleSelectOne(deportista.id)}
                            className="rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                            {generateDisplayId(deportista, (currentPage - 1) * itemsPerPage + index)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md ${
                              deportista.afiliacion
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                            }`}
                          >
                            {deportista.afiliacion ? "Afiliado" : "No Afiliado"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {deportista.cedula}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {deportista.apellidos}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {deportista.nombres}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(deportista.fechaNacimiento)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {deportista.club ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(`/mis-deportistas/${deportista.id}/editar`)
                              }
                              className="p-1.5 text-gray-400 hover:text-violet-500 transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrando{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {startItem}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {endItem}
                  </span>{" "}
                  dentro de{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {totalItems}
                  </span>{" "}
                  resultados
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
