"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Check,
  Search,
} from "lucide-react";

import AlertBanner from "@/components/ui/alert-banner";
import { listEventos, type ListEventosOptions } from "@/lib/api/eventos";
import { createAval } from "@/lib/api/avales";
import type { Evento } from "@/types/evento";
import { useAuth } from "@/app/providers/auth-provider";

const PAGE_SIZE = 12;

function formatDateRange(inicio?: string | null, fin?: string | null) {
  if (!inicio) return "-";
  const startDate = new Date(inicio);
  const endDate = fin ? new Date(fin) : null;

  if (Number.isNaN(startDate.getTime())) return "-";

  const startStr = startDate.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
  });

  if (!endDate || Number.isNaN(endDate.getTime())) {
    return `${startStr}, ${startDate.getFullYear()}`;
  }

  const endStr = endDate.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startStr} - ${endStr}`;
}

function formatLocation(evento: Evento) {
  const parts = [evento.ciudad, evento.provincia].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
}

function getTotalParticipants(evento: Evento) {
  return (
    (evento.numAtletasHombres || 0) +
    (evento.numAtletasMujeres || 0) +
    (evento.numEntrenadoresHombres || 0) +
    (evento.numEntrenadoresMujeres || 0)
  );
}

export default function NuevoAvalPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEntrenador =
    user?.roles?.includes("ENTRENADOR") &&
    !user?.roles?.includes("SUPER_ADMIN") &&
    !user?.roles?.includes("ADMIN");

  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const options: ListEventosOptions = {
        limit: PAGE_SIZE,
        estado: "DISPONIBLE",
        search: search.trim() || undefined,
      };

      // Si es entrenador, filtrar por su disciplina
      if (isEntrenador && user?.disciplinaId) {
        options.disciplinaId = user.disciplinaId;
      }

      const res = await listEventos(options);
      setEventos(res.data ?? []);
    } catch (err: any) {
      setError(err?.message ?? "No se pudieron cargar los eventos.");
    } finally {
      setLoading(false);
    }
  }, [search, isEntrenador, user?.disciplinaId]);

  useEffect(() => {
    void fetchEventos();
  }, [fetchEventos]);

  const handleSubmit = async () => {
    if (!selectedEvento) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      await createAval({ eventoId: selectedEvento.id });
      router.push("/avales?status=created");
    } catch (err: any) {
      setSubmitError(err?.message ?? "No se pudo crear el aval.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitError && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full drop-shadow-lg">
          <AlertBanner
            variant="error"
            message={submitError}
            onClose={() => setSubmitError(null)}
          />
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/avales"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a mis avales
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Crear nuevo aval
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selecciona un evento disponible para solicitar tu aval.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="form-input w-full pl-10"
            placeholder="Buscar evento por nombre, lugar o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Info de disciplina para entrenadores */}
        {isEntrenador && user?.disciplina?.nombre && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-4 py-3 text-sm text-indigo-700 dark:text-indigo-300">
            Mostrando eventos de tu disciplina: <strong>{user.disciplina.nombre}</strong>
          </div>
        )}

        {/* Lista de eventos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl p-6 text-center">
            {error}
          </div>
        ) : eventos.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="mb-2">No hay eventos disponibles.</p>
            <p className="text-sm">
              {search
                ? "Intenta con otros términos de búsqueda."
                : "No se encontraron eventos para tu disciplina."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventos.map((evento) => {
              const isSelected = selectedEvento?.id === evento.id;

              return (
                <button
                  key={evento.id}
                  type="button"
                  onClick={() => setSelectedEvento(isSelected ? null : evento)}
                  className={`text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 transition-all border-2 ${
                    isSelected
                      ? "border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20"
                      : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200">
                          Disponible
                        </span>
                        {evento.alcance && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {evento.alcance}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {evento.nombre || "Sin nombre"}
                      </h3>
                      {evento.codigo && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {evento.codigo}
                        </p>
                      )}
                    </div>

                    {/* Indicador de selección */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {evento.tipoEvento && (
                      <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        {evento.tipoEvento}
                      </span>
                    )}
                    {evento.disciplina?.nombre && (
                      <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
                        {evento.disciplina.nombre}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{formatDateRange(evento.fechaInicio, evento.fechaFin)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{formatLocation(evento)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{getTotalParticipants(evento)} participantes</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer con botón de crear */}
        {selectedEvento && (
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mt-6">
            <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Evento seleccionado:
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {selectedEvento.nombre}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Solicitando..." : "Solicitar aval"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
