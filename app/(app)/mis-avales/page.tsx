"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { listEventos } from "@/lib/api/evento";
import type { Evento, EventoStatus } from "@/types/evento";
import AvalCard from "@/components/avales/aval-card";
import AlertBanner from "@/components/ui/alert-banner";

const STATUS_OPTIONS: { value: EventoStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "DISPONIBLE", label: "Disponibles" },
  { value: "SOLICITADO", label: "Solicitados" },
  { value: "ACEPTADO", label: "Aceptados" },
  { value: "RECHAZADO", label: "Rechazados" },
];

export default function MisAvalesPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as EventoStatus | null;

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<EventoStatus | "">(
    statusParam && STATUS_OPTIONS.some((o) => o.value === statusParam)
      ? statusParam
      : ""
  );
  const [showSuccess, setShowSuccess] = useState(
    searchParams.get("status") === "success"
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listEventos(
          filterStatus ? { estado: filterStatus } : undefined
        );
        setEventos(res.data?.items ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar los eventos");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [filterStatus]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Mis Eventos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestiona tus eventos deportivos y solicitudes de aval
          </p>
        </div>

        <Link
          href="/mis-avales/nuevo"
          className="btn bg-violet-500 hover:bg-violet-600 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </Link>
      </div>

      {/* Alert de éxito */}
      {showSuccess && (
        <div className="mb-6">
          <AlertBanner
            variant="success"
            message="Operación realizada correctamente"
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}

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
          Cargando eventos...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {/* Lista de eventos */}
      {!loading && !error && (
        <>
          {eventos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No tienes eventos{filterStatus ? ` con estado "${filterStatus}"` : ""}
              </p>
              <Link
                href="/mis-avales/nuevo"
                className="btn bg-violet-500 hover:bg-violet-600 text-white inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear mi primer evento
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventos.map((evento) => (
                <AvalCard
                  key={evento.id}
                  evento={evento}
                  href={`/mis-avales/${evento.id}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
