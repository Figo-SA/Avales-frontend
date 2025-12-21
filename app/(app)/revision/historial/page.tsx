"use client";

import { useEffect, useState } from "react";
import { History, FileCheck, Filter } from "lucide-react";
import { listEventos } from "@/lib/api/evento";
import type { Evento, EventoStatus } from "@/types/evento";
import AvalCard from "@/components/avales/aval-card";

const STATUS_OPTIONS: { value: EventoStatus; label: string }[] = [
  { value: "ACEPTADO", label: "Aceptados" },
  { value: "RECHAZADO", label: "Rechazados" },
];

export default function HistorialRevisionPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<EventoStatus>("ACEPTADO");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await listEventos({ estado: filterStatus });
        setEventos(res.data?.items ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar historial");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [filterStatus]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <History className="w-8 h-8 text-violet-500" />
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Historial de Revisiones
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Eventos que han sido procesados
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  filterStatus === option.value
                    ? "bg-violet-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Cargando historial...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {/* Lista */}
      {!loading && !error && (
        <>
          {eventos.length === 0 ? (
            <div className="text-center py-16">
              <FileCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                No hay eventos {filterStatus === "ACEPTADO" ? "aceptados" : "rechazados"}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Los eventos procesados aparecerán aquí
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 px-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {eventos.length} evento{eventos.length !== 1 ? "s" : ""}{" "}
                  {filterStatus === "ACEPTADO" ? "aceptado" : "rechazado"}
                  {eventos.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventos.map((evento) => (
                  <AvalCard
                    key={evento.id}
                    evento={evento}
                    href={`/revision/${evento.id}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
