"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileEdit,
} from "lucide-react";

import type { Aval, Historial } from "@/types/aval";
import type { User } from "@/types/user";
import { aprobarAval, rechazarAval } from "@/lib/api/avales";
import { getAvalStatusClasses } from "@/lib/constants";
import {
  formatDate,
  formatDateRange,
  formatLocation,
} from "@/lib/utils/formatters";

function getLatestHistorialEntry(historial?: Historial[]) {
  if (!historial || historial.length === 0) return undefined;
  return historial.reduce<Historial | undefined>((latest, entry) => {
    if (!entry.createdAt) return latest ?? entry;
    if (!latest) return entry;
    const latestTime = new Date(latest.createdAt).getTime();
    const entryTime = new Date(entry.createdAt).getTime();
    if (Number.isNaN(entryTime)) return latest;
    if (Number.isNaN(latestTime)) return entry;
    return entryTime > latestTime ? entry : latest;
  }, undefined);
}

function getCurrentEtapa(historial?: Historial[]) {
  return getLatestHistorialEntry(historial)?.etapa;
}

type Props = {
  avales: Aval[];
  loading?: boolean;
  error?: string | null;
  isAdmin?: boolean;
  currentUser?: User | null;
  onActionResult?: (
    message: string,
    variant?: "success" | "error",
  ) => void;
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  DISPONIBLE: AlertCircle,
  BORRADOR: FileEdit,
  SOLICITADO: Clock,
  ACEPTADO: CheckCircle,
  RECHAZADO: XCircle,
};

function getStatusIcon(status?: string | null) {
  if (!status) return AlertCircle;
  return STATUS_ICONS[status.toUpperCase()] ?? AlertCircle;
}

export default function AvalListCard({
  avales,
  loading,
  error,
  isAdmin = false,
  currentUser,
  onActionResult,
}: Props) {
  const [loadingAvalId, setLoadingAvalId] = useState<number | null>(null);
  const userRoles = currentUser?.roles ?? [];
  const isMetodologo = userRoles.includes("METODOLOGO");
  const isDtm = userRoles.includes("DTM");
  const isPda = userRoles.includes("PDA");

  const handleActionResult = (
    message: string,
    variant: "success" | "error" = "success",
  ) => {
    onActionResult?.(message, variant);
  };

  const handleApprove = async (avalId: number) => {
    if (!currentUser?.id) {
      handleActionResult("No se pudo identificar el usuario.", "error");
      return;
    }

    setLoadingAvalId(avalId);
    try {
      await aprobarAval(avalId, currentUser.id);
      handleActionResult("Aval aprobado correctamente.", "success");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo aprobar el aval. Intenta nuevamente.";
      handleActionResult(message, "error");
    } finally {
      setLoadingAvalId(null);
    }
  };

  const handleReject = async (avalId: number) => {
    if (!currentUser?.id) {
      handleActionResult("No se pudo identificar el usuario.", "error");
      return;
    }

    if (typeof window === "undefined") return;
    const motivoInput = window.prompt(
      "Motivo del rechazo (opcional):",
      "",
    )?.trim();

    setLoadingAvalId(avalId);
    try {
      await rechazarAval(
        avalId,
        currentUser.id,
        motivoInput?.length ? motivoInput : undefined,
      );
      handleActionResult("Aval rechazado correctamente.", "success");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo rechazar el aval. Intenta nuevamente.";
      handleActionResult(message, "error");
    } finally {
      setLoadingAvalId(null);
    }
  };
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
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
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl p-6 text-center">
        {error}
      </div>
    );
  }

  if (avales.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center text-gray-500 dark:text-gray-400">
        <p className="mb-2">
          {isAdmin ? "No hay avales registrados en el sistema." : "No tienes avales registrados."}
        </p>
        {!isAdmin && !isPda && !isDtm && (
          <p className="text-sm">
            Haz clic en &quot;Crear aval&quot; para solicitar uno nuevo.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {avales.map((aval) => {
        const statusStyles = getAvalStatusClasses(aval.estado);
        const StatusIcon = getStatusIcon(aval.estado);
        const etapaActual = getCurrentEtapa(aval.historial);
        const showMetodologoActions =
          (isMetodologo || isDtm) &&
          aval.estado === "SOLICITADO" &&
          etapaActual === "REVISION_METODOLOGO";
        const showPdaActions =
          isPda &&
          aval.estado === "SOLICITADO" &&
          etapaActual === "PDA";
        const showReviewerActions = showMetodologoActions || showPdaActions;
        const isActionLoading = loadingAvalId === aval.id;

        return (
          <div
            key={aval.id}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
          >
            {/* Header con estado */}
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {aval.estado || "Sin estado"}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {aval.evento?.nombre || "Sin evento"}
                </h3>
                {aval.evento?.codigo && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Código: {aval.evento.codigo}
                  </p>
                )}
              </div>
            </div>

            {/* Info del evento */}
            <div className="px-5 pb-4 flex-1 space-y-3">
              {/* Alerta de BORRADOR - solo para entrenadores */}
              {!isAdmin && aval.estado === "BORRADOR" && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                        Aval incompleto
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                        La convocatoria fue subida. Completa el aval técnico
                        para solicitar aprobación.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fechas del evento */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                  <span>
                    {formatDateRange(
                      aval.evento?.fechaInicio,
                      aval.evento?.fechaFin
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                  <span className="truncate">
                    {formatLocation(aval.evento)}
                  </span>
                </div>
              </div>

              {/* Fecha de creación */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Creado el {formatDate(aval.createdAt)}
                </p>
                {aval.updatedAt && aval.createdAt !== aval.updatedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Actualizado el {formatDate(aval.updatedAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Footer con acción */}
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700/60 flex flex-col gap-2">
              {showReviewerActions && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isActionLoading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-rose-300 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleReject(aval.id)}
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    disabled={isActionLoading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleApprove(aval.id)}
                  >
                    Aprobar
                  </button>
                </div>
              )}
              <div className="flex items-center justify-end gap-2">
                {!isAdmin && aval.estado === "BORRADOR" ? (
                  <>
                    <Link
                      href={`/avales/${aval.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalle
                    </Link>
                    <Link
                      href={`/avales/${aval.id}/crear-solicitud`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                    >
                      <FileEdit className="w-4 h-4" />
                      Editar solicitud
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/avales/${aval.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/40 dark:hover:text-sky-300 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalle
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
