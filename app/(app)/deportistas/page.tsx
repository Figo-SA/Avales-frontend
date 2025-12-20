"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AlertBanner from "@/components/ui/alert-banner";
import Pagination from "@/components/ui/pagination";
import DeportistaTable from "./_components/deportista-table";
import { listDeportistas } from "@/lib/api/deportistas";
import type { Deportista } from "@/types/deportista";

const PAGE_SIZE = 10;

export default function DeportistasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(() => searchParams.get("query") ?? "");
  const [sexo, setSexo] = useState(() => searchParams.get("sexo") ?? "");
  const [page, setPage] = useState(() => {
    const value = Number(searchParams.get("page") ?? "1");
    return Number.isFinite(value) && value > 0 ? value : 1;
  });
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page,
    limit: PAGE_SIZE,
    total: 0,
  });

  const limit = pagination.limit || PAGE_SIZE;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((pagination.total || 0) / limit)),
    [pagination.total, limit]
  );
  const currentPage = Math.min(page, totalPages);
  const showing = deportistas.length;

  useEffect(() => {
    if (page === currentPage) return;
    setPage(currentPage);
  }, [page, currentPage]);

  useEffect(() => {
    const fetchDeportistas = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listDeportistas({
          query: q.trim() || undefined,
          sexo: sexo || undefined,
          page: currentPage,
          limit: PAGE_SIZE,
        });
        const items = res.data ?? [];
        const meta = res.meta;
        setDeportistas(items);
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
              : items.length ?? 0,
        });
      } catch (err: any) {
        setError(err?.message ?? "No se pudo cargar los deportistas.");
      } finally {
        setLoading(false);
      }
    };

    void fetchDeportistas();
  }, [currentPage, q, sexo]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("query", q.trim());
    if (sexo) params.set("sexo", sexo);
    if (currentPage > 1) params.set("page", String(currentPage));

    router.replace(
      params.toString() ? `/deportistas?${params}` : "/deportistas",
      { scroll: false }
    );
  }, [q, sexo, currentPage, router]);

  return (
    <>
      {error && !loading && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full drop-shadow-lg">
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
              Deportistas
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vista principal con el listado de deportistas afiliados.
            </p>
          </div>

          <div className="grid grid-flow-row sm:grid-flow-col sm:auto-cols-max sm:justify-end gap-2 w-full sm:w-auto">
            <input
              className="form-input w-full sm:w-64"
              placeholder="Buscar por nombres, apellidos o cedula"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />
            <select
              className="form-select w-full sm:w-40"
              value={sexo}
              onChange={(e) => {
                setPage(1);
                setSexo(e.target.value);
              }}
            >
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
        </div>

        <DeportistaTable
          deportistas={deportistas}
          loading={loading}
          error={error}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-0">
            Pagina {currentPage} de {totalPages} (mostrando {showing} de{" "}
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
