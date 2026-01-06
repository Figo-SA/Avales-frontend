"use client";

import Link from "next/link";
import { Calendar, MapPin, Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

import type { Aval } from "@/types/aval";

type Props = {
  avales: Aval[];
  loading?: boolean;
  error?: string | null;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  DISPONIBLE: {
    bg: "bg-blue-100 dark:bg-blue-900/60",
    text: "text-blue-800 dark:text-blue-200",
    icon: AlertCircle,
  },
  SOLICITADO: {
    bg: "bg-amber-100 dark:bg-amber-900/60",
    text: "text-amber-800 dark:text-amber-200",
    icon: Clock,
  },
  ACEPTADO: {
    bg: "bg-green-100 dark:bg-green-900/60",
    text: "text-green-800 dark:text-green-200",
    icon: CheckCircle,
  },
  RECHAZADO: {
    bg: "bg-rose-100 dark:bg-rose-900/60",
    text: "text-rose-800 dark:text-rose-200",
    icon: XCircle,
  },
};

function getStatusStyles(status?: string | null) {
  if (!status)
    return {
      bg: "bg-gray-100 dark:bg-gray-800/50",
      text: "text-gray-800 dark:text-gray-200",
      icon: AlertCircle,
    };
  return (
    STATUS_STYLES[status.toUpperCase()] ?? {
      bg: "bg-gray-100 dark:bg-gray-800/50",
      text: "text-gray-800 dark:text-gray-200",
      icon: AlertCircle,
    }
  );
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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

function formatLocation(evento: Aval["evento"]) {
  const parts = [evento.ciudad, evento.pais].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
}

export default function AvalListCard({ avales, loading, error }: Props) {
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
        <p className="mb-2">No tienes avales registrados.</p>
        <p className="text-sm">Haz clic en "Crear aval" para solicitar uno nuevo.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {avales.map((aval) => {
        const statusStyles = getStatusStyles(aval.estado);
        const StatusIcon = statusStyles.icon;

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
              {/* Fechas del evento */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span>
                    {formatDateRange(aval.evento?.fechaInicio, aval.evento?.fechaFin)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="truncate">
                    {aval.evento ? formatLocation(aval.evento) : "-"}
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
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end">
              <Link
                href={`/avales/${aval.id}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/40 dark:hover:text-sky-300 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver detalle
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
