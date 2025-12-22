"use client";

import { useCallback, useEffect, useState } from "react";

import AlertBanner from "@/components/ui/alert-banner";
import EventoTable from "./_components/evento-table";
import { listEventos } from "@/lib/api/eventos";
import type { Evento } from "@/types/evento";

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listEventos();
      setEventos(res.data ?? []);
    } catch (err: any) {
      const message = err?.message ?? "No se pudieron cargar los eventos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEventos();
  }, [fetchEventos]);

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
              Vista general para gestionar eventos registrados.
            </p>
          </div>

          <div className="grid grid-flow-row sm:grid-flow-col sm:auto-cols-max sm:justify-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              onClick={() => {
                void fetchEventos();
              }}
              disabled={loading}
            >
              Recargar
            </button>
          </div>
        </div>

        <EventoTable eventos={eventos} loading={loading} error={error} />
      </div>
    </>
  );
}
