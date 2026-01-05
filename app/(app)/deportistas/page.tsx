"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AlertBanner from "@/components/ui/alert-banner";
import ConfirmModal from "@/components/ui/confirm-modal";
import Pagination from "@/components/ui/pagination";
import DeportistaTable from "./_components/deportista-table";
import {
  listDeportistas,
  softDeleteDeportista,
} from "@/lib/api/deportistas";
import type { Deportista } from "@/types/deportista";

const PAGE_SIZE = 10;

export default function DeportistasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(() => searchParams.get("query") ?? "");
  const [genero, setGenero] = useState(() => searchParams.get("genero") ?? "");
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
  const [toast, setToast] = useState<{
    variant: "success" | "error";
    message: string;
    description?: string;
  } | null>(null);

  const limit = pagination.limit || PAGE_SIZE;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((pagination.total || 0) / limit)),
    [pagination.total, limit]
  );
  const currentPage = Math.min(page, totalPages);
  const showing = deportistas.length;
  const [confirmDeportista, setConfirmDeportista] =
    useState<Deportista | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (page === currentPage) return;
    setPage(currentPage);
  }, [page, currentPage]);

  const fetchDeportistas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listDeportistas({
        query: q.trim() || undefined,
        genero: genero || undefined,
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
      const msg = err?.message ?? "No se pudo cargar los deportistas.";
      setError(msg);
      setToast({ variant: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [currentPage, q, genero]);

  useEffect(() => {
    void fetchDeportistas();
  }, [fetchDeportistas]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("query", q.trim());
    if (genero) params.set("genero", genero);
    if (currentPage > 1) params.set("page", String(currentPage));

    router.replace(
      params.toString() ? `/deportistas?${params}` : "/deportistas",
      { scroll: false }
    );
  }, [q, genero, currentPage, router]);

  // mostrar toast cuando viene status=created desde la creacion
  useEffect(() => {
    const status = searchParams.get("status");
    if (!status) return;

    if (status === "created") {
      setToast({
        variant: "success",
        message: "Deportista creado correctamente.",
        description: "El listado se actualiza automaticamente.",
      });
    } else if (status === "updated") {
      setToast({
        variant: "success",
        message: "Deportista actualizado correctamente.",
      });
    } else if (status === "error") {
      setToast({
        variant: "error",
        message: "No se pudo procesar la solicitud.",
      });
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    router.replace(
      params.toString() ? `/deportistas?${params}` : "/deportistas",
      { scroll: false }
    );
  }, [searchParams, router]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (confirmOpen) return;
    const timer = setTimeout(() => setConfirmDeportista(null), 180);
    return () => clearTimeout(timer);
  }, [confirmOpen]);

  const handleDelete = (deportista: Deportista) => {
    setConfirmDeportista(deportista);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmDeportista) return;
    try {
      setDeleting(true);
      await softDeleteDeportista(confirmDeportista.id);
      setToast({
        variant: "success",
        message: "Deportista eliminado correctamente.",
      });
      await fetchDeportistas();
    } catch (err: any) {
      setToast({
        variant: "error",
        message: err?.message ?? "No se pudo eliminar el deportista.",
      });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full drop-shadow-lg">
          <AlertBanner
            variant={toast.variant}
            message={toast.message}
            description={toast.description}
            onClose={() => setToast(null)}
          />
        </div>
      )}

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
              value={genero}
              onChange={(e) => {
                setPage(1);
                setGenero(e.target.value);
              }}
            >
              <option value="">Todos</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
            </select>
            <a
              href="/deportistas/nuevo"
              className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              Nuevo deportista
            </a>
          </div>
        </div>

        <DeportistaTable
          deportistas={deportistas}
          loading={loading}
          error={error}
          onDelete={handleDelete}
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
      <ConfirmModal
        open={confirmOpen}
        title="Eliminar deportista"
        description={`Seguro que quieres eliminar a ${
          confirmDeportista?.nombres ?? confirmDeportista?.cedula ?? ""
        }?`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (deleting) return;
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
