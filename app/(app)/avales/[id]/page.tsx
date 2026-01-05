"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Tag,
  Globe,
  FileText,
  Clock,
  UserCheck,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
} from "lucide-react";

import AlertBanner from "@/components/ui/alert-banner";
import ConfirmModal from "@/components/ui/confirm-modal";
import { getAval, cancelAval } from "@/lib/api/avales";
import type { Aval } from "@/types/aval";
import { calcularTotalEvento } from "@/types/evento";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string; icon: typeof Clock }
> = {
  PENDIENTE: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    icon: Clock,
  },
  APROBADO: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
    dot: "bg-green-500",
    icon: CheckCircle,
  },
  RECHAZADO: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    icon: XCircle,
  },
};

function getStatusStyles(status?: string | null) {
  if (!status)
    return {
      bg: "bg-gray-50 dark:bg-gray-800/50",
      text: "text-gray-700 dark:text-gray-300",
      dot: "bg-gray-400",
      icon: AlertCircle,
    };
  return (
    STATUS_STYLES[status.toUpperCase()] ?? {
      bg: "bg-gray-50 dark:bg-gray-800/50",
      text: "text-gray-700 dark:text-gray-300",
      dot: "bg-gray-400",
      icon: AlertCircle,
    }
  );
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatGenero(genero?: string | null) {
  if (!genero) return "-";
  const map: Record<string, string> = {
    MASCULINO: "Masculino",
    FEMENINO: "Femenino",
    MASCULINO_FEMENINO: "Mixto",
  };
  return map[genero.toUpperCase()] ?? genero;
}

function getDaysUntilEvent(fechaInicio?: string | null) {
  if (!fechaInicio) return null;
  const start = new Date(fechaInicio);
  if (Number.isNaN(start.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diff = Math.ceil(
    (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

function getEventDuration(
  fechaInicio?: string | null,
  fechaFin?: string | null
) {
  if (!fechaInicio || !fechaFin) return null;
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const diff =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function formatMes(mes: number) {
  return MESES[mes - 1] || `Mes ${mes}`;
}

export default function AvalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [aval, setAval] = useState<Aval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("ID de aval inválido");
      setLoading(false);
      return;
    }

    async function fetchAval() {
      try {
        setLoading(true);
        const res = await getAval(id);
        setAval(res.data);
      } catch (err: any) {
        setError(err?.message ?? "No se pudo cargar el aval.");
      } finally {
        setLoading(false);
      }
    }

    void fetchAval();
  }, [id]);

  const handleCancel = async () => {
    if (!aval) return;
    try {
      setCancelling(true);
      await cancelAval(aval.id);
      router.push("/avales?status=cancelled");
    } catch (err: any) {
      setError(err?.message ?? "No se pudo cancelar el aval.");
      setConfirmOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !aval) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto">
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl p-6 text-center">
          {error ?? "Aval no encontrado"}
        </div>
        <div className="mt-4">
          <Link
            href="/avales"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a mis avales
          </Link>
        </div>
      </div>
    );
  }

  const evento = aval.evento;
  const statusStyles = getStatusStyles(aval.estado);
  const StatusIcon = statusStyles.icon;
  const daysUntil = evento ? getDaysUntilEvent(evento.fechaInicio) : null;
  const duration = evento
    ? getEventDuration(evento.fechaInicio, evento.fechaFin)
    : null;

  const totalAtletas = evento
    ? (evento.numAtletasHombres || 0) + (evento.numAtletasMujeres || 0)
    : 0;
  const totalEntrenadores = evento
    ? (evento.numEntrenadoresHombres || 0) + (evento.numEntrenadoresMujeres || 0)
    : 0;

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full drop-shadow-lg">
          <AlertBanner
            variant="error"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/avales"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a mis avales
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Detalle del Aval
            </h1>
            {aval.codigo && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Código: {aval.codigo}
              </p>
            )}
          </div>

          {/* Botón de cancelar solo si está pendiente */}
          {aval.estado === "PENDIENTE" && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="btn bg-rose-500 hover:bg-rose-600 text-white"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar solicitud
            </button>
          )}
        </div>

        {/* Estado del aval */}
        <div
          className={`rounded-xl p-5 ${statusStyles.bg} border ${
            aval.estado === "PENDIENTE"
              ? "border-amber-200 dark:border-amber-800/40"
              : aval.estado === "APROBADO"
              ? "border-green-200 dark:border-green-800/40"
              : "border-rose-200 dark:border-rose-800/40"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <StatusIcon className={`w-6 h-6 ${statusStyles.text}`} />
            <h2 className={`text-lg font-semibold ${statusStyles.text}`}>
              {aval.estado === "PENDIENTE"
                ? "Solicitud Pendiente"
                : aval.estado === "APROBADO"
                ? "Aval Aprobado"
                : "Solicitud Rechazada"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Fecha de solicitud
              </p>
              <p className={`font-medium ${statusStyles.text}`}>
                {formatDate(aval.fechaSolicitud)}
              </p>
            </div>
            {aval.fechaRespuesta && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Fecha de respuesta
                </p>
                <p className={`font-medium ${statusStyles.text}`}>
                  {formatDate(aval.fechaRespuesta)}
                </p>
              </div>
            )}
            {aval.aprobadoPor && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  {aval.estado === "APROBADO" ? "Aprobado por" : "Respondido por"}
                </p>
                <p className={`font-medium ${statusStyles.text}`}>
                  {aval.aprobadoPor.nombre} {aval.aprobadoPor.apellido}
                </p>
              </div>
            )}
          </div>
          {aval.observaciones && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Observaciones
              </p>
              <p className={`${statusStyles.text}`}>{aval.observaciones}</p>
            </div>
          )}
        </div>

        {/* Información del evento */}
        {evento && (
          <>
            <div className="flex items-center gap-2 pt-4">
              <Trophy className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Evento Asociado
              </h2>
            </div>

            {/* Estado y badges del evento */}
            <div className="flex flex-wrap items-center gap-3">
              {evento.alcance && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
                  <Globe className="w-3.5 h-3.5" />
                  {evento.alcance}
                </span>
              )}
              {evento.tipoEvento && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm">
                  <Trophy className="w-3.5 h-3.5" />
                  {evento.tipoEvento}
                </span>
              )}
              {evento.tipoParticipacion && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm">
                  <UserCheck className="w-3.5 h-3.5" />
                  {evento.tipoParticipacion}
                </span>
              )}
            </div>

            {/* Nombre del evento */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {evento.nombre}
              </h3>
              {evento.codigo && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Código: {evento.codigo}
                </p>
              )}
            </div>

            {/* Tarjetas de información */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Columna izquierda */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Fechas */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Fechas
                      </h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Inicio</p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                          {formatDate(evento.fechaInicio)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Fin</p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                          {formatDate(evento.fechaFin)}
                        </p>
                      </div>
                      {duration && (
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-gray-500 dark:text-gray-400">
                            Duración
                          </p>
                          <p className="text-gray-900 dark:text-gray-100 font-medium">
                            {duration} {duration === 1 ? "día" : "días"}
                          </p>
                        </div>
                      )}
                      {daysUntil !== null && daysUntil >= 0 && (
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                              {daysUntil === 0
                                ? "¡Hoy!"
                                : daysUntil === 1
                                ? "Mañana"
                                : `En ${daysUntil} días`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Ubicación
                      </h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      {evento.lugar && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Lugar</p>
                          <p className="text-gray-900 dark:text-gray-100 font-medium">
                            {evento.lugar}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Ciudad</p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {evento.ciudad || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Provincia
                        </p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {evento.provincia || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">País</p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {evento.pais || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Categoría y Disciplina */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Clasificación
                      </h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Disciplina
                        </p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {evento.disciplina?.nombre || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Categoría
                        </p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {evento.categoria?.nombre || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Género</p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {formatGenero(evento.genero)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Participantes */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-5">
                  <Users className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Participantes
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {evento.numAtletasHombres || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Atletas (H)
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {evento.numAtletasMujeres || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Atletas (M)
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {evento.numEntrenadoresHombres || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Entrenadores (H)
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {evento.numEntrenadoresMujeres || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Entrenadores (M)
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {totalAtletas}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Atletas
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {totalEntrenadores}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Entrenadores
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Presupuestarios */}
            {evento.eventoItems && evento.eventoItems.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Items Presupuestarios
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {evento.eventoItems.length} items asignados
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30">
                      <tr>
                        <th className="px-4 py-3 text-left">Item</th>
                        <th className="px-4 py-3 text-left">Actividad</th>
                        <th className="px-4 py-3 text-center">Mes</th>
                        <th className="px-4 py-3 text-right">Presupuesto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                      {evento.eventoItems.map((eventoItem) => (
                        <tr key={eventoItem.id} className="text-sm">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {eventoItem.item.numero}. {eventoItem.item.nombre}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {eventoItem.item.actividad ? (
                              <span>
                                {eventoItem.item.actividad.numero}.{" "}
                                {eventoItem.item.actividad.nombre}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {formatMes(eventoItem.mes)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(
                              parseFloat(eventoItem.presupuesto) || 0
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-emerald-800/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Total Presupuesto
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(calcularTotalEvento(evento))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Cancelar solicitud de aval"
        description="¿Seguro que quieres cancelar esta solicitud de aval? Esta acción no se puede deshacer."
        confirmLabel="Cancelar solicitud"
        cancelLabel="Volver"
        loading={cancelling}
        onConfirm={handleCancel}
        onClose={() => {
          if (cancelling) return;
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
