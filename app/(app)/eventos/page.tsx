"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AlertBanner from "@/components/ui/alert-banner";
import EventoTable from "./_components/evento-table";
import Pagination from "@/components/ui/pagination";
import { listEventos, type ListEventosOptions } from "@/lib/api/eventos";
import type { Evento } from "@/types/evento";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "Todos los estados", value: "" },
  { label: "Disponible", value: "DISPONIBLE" },
  { label: "Solicitado", value: "SOLICITADO" },
  { label: "Rechazado", value: "RECHAZADO" },
  { label: "Aceptado", value: "ACEPTADO" },
];

export default function EventosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [estado, setEstado] = useState(() => searchParams.get("estado") ?? "");
  const [page, setPage] = useState(() => {
    const value = Number(searchParams.get("page") ?? "1");
    return Number.isFinite(value) && value > 0 ? value : 1;
  });
  const [pagination, setPagination] = useState({
    page,
    limit: PAGE_SIZE,
    total: 0,
  });

  const pageSize = pagination.limit || PAGE_SIZE;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((pagination.total || 0) / pageSize)),
    [pagination.total, pageSize]
  );
  const currentPage = Math.min(page, totalPages);
  const showing = eventos.length;

  useEffect(() => {
    if (page === currentPage) return;
    setPage(currentPage);
  }, [page, currentPage]);

  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const options: ListEventosOptions = {
        page: currentPage,
        limit: PAGE_SIZE,
        estado: estado || undefined,
        search: search.trim() || undefined,
      };
      const res = await listEventos(options);
      const items = res.data ?? [];
      const meta = res.meta;
      setEventos(items);
      setPagination({
        page:
          typeof meta?.page === "number" && meta.page > 0
            ? meta.page
            : currentPage,
        limit:
          typeof meta?.limit === "number" && meta.limit > 0
            ? meta.limit
            : PAGE_SIZE,
        total:
          typeof meta?.total === "number" && meta.total >= 0
            ? meta.total
            : items.length,
      });
    } catch (err: any) {
      const message = err?.message ?? "No se pudieron cargar los eventos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, estado, search]);

  useEffect(() => {
    void fetchEventos();
  }, [fetchEventos]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (estado) params.set("estado", estado);
    if (currentPage > 1) params.set("page", String(currentPage));

    router.replace(
      params.toString() ? `/eventos?${params}` : "/eventos",
      { scroll: false }
    );
  }, [search, estado, currentPage, router]);

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full drop-shadow-lg">
          <AlertBanner
            variant="error"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto space-y-6">
        <div className="sm:flex sm:justify-between sm:items-center gap-4">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Eventos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestión paginada y filtrada de eventos activos.
            </p>
          </div>

          <div className="grid grid-flow-row sm:grid-flow-col sm:auto-cols-max sm:justify-end gap-2 w-full sm:w-auto">
            <input
              className="form-input w-full sm:w-64"
              placeholder="Buscar por nombre, lugar o código"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
            <select
              className="form-select w-full sm:w-48"
              value={estado}
              onChange={(e) => {
                setPage(1);
                setEstado(e.target.value);
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              disabled={loading}
              onClick={() => {
                void fetchEventos();
              }}
            >
              Recargar
            </button>
          </div>
        </div>

        <EventoTable eventos={eventos} loading={loading} error={error} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-0">
            Página {currentPage} de {totalPages} (mostrando {showing} de{" "}
            {pagination.total})
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
}
