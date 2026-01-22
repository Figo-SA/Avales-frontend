"use client";

import { useCallback, useEffect, useState } from "react";
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
  Target,
  Plane,
  Building2,
} from "lucide-react";

import AlertBanner from "@/components/ui/alert-banner";
import ApprovalFlowCard from "../_components/approval-flow-card";
import ConfirmModal from "@/components/ui/confirm-modal";
import { useAuth } from "@/app/providers/auth-provider";
import { aprobarAval, getAval, rechazarAval } from "@/lib/api/avales";
import type { Aval, EtapaFlujo, Historial } from "@/types/aval";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/utils/formatters";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string; icon: typeof Clock }
> = {
  BORRADOR: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
    icon: FileText,
  },
  SOLICITADO: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    icon: Clock,
  },
  ACEPTADO: {
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
    (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

function getEventDuration(
  fechaInicio?: string | null,
  fechaFin?: string | null,
) {
  if (!fechaInicio || !fechaFin) return null;
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const diff =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
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

const REVIEWER_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "METODOLOGO",
  "DTM",
  "PDA",
  "CONTROL_PREVIO",
  "SECRETARIA",
  "FINANCIERO",
] as const;

const STAGE_FLOW: EtapaFlujo[] = [
  "SOLICITUD",
  "REVISION_METODOLOGO",
  "REVISION_DTM",
  "PDA",
  "CONTROL_PREVIO",
  "SECRETARIA",
  "FINANCIERO",
];

const STAGE_LABELS: Record<EtapaFlujo, string> = {
  SOLICITUD: "Solicitud",
  REVISION_METODOLOGO:
    "Aval aprobado metodólogo (Director técnico metodológico)",
  REVISION_DTM: "Revisión DTM",
  PDA: "PDA",
  CONTROL_PREVIO: "Control previo",
  SECRETARIA: "Secretaría",
  FINANCIERO: "Financiero",
};

function getStageLabel(etapa: EtapaFlujo) {
  return STAGE_LABELS[etapa] ?? etapa;
}

function getNextEtapa(etapa: EtapaFlujo): EtapaFlujo | undefined {
  const index = STAGE_FLOW.indexOf(etapa);
  if (index === -1 || index === STAGE_FLOW.length - 1) {
    return undefined;
  }
  return STAGE_FLOW[index + 1];
}

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

export default function AvalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { user } = useAuth();

  const [rechazoMotivo, setRechazoMotivo] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);

  const [aval, setAval] = useState<Aval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const userRoles = user?.roles ?? [];
  const canReview = userRoles.some((role) => REVIEWER_ROLES.includes(role));
  const showApprovalPanel = canReview && aval?.estado === "SOLICITADO";
  const etapaActualHistorial = getCurrentEtapa(aval?.historial);
  const currentEtapa = (etapaActualHistorial ?? "SOLICITUD") as EtapaFlujo;
  const nextEtapa = getNextEtapa(currentEtapa);
  const approvalEtapa = nextEtapa ?? currentEtapa;
  const arrowCurrentLabel = "Solicitud aval";
  const arrowNextLabel = "Aval aprobado por el metodólogo";
  const summaryLines = [
    'El aval pasará de "Solicitud" a estar "Revisado por el metodólogo".',
    'Al aprobar el aval quedará en revisión con "el director técnico metodológico" (DTM) hasta que confirme la siguiente etapa.',
  ];

  const fetchAval = useCallback(async () => {
    if (!id || Number.isNaN(id)) {
      setError("ID de aval inválido");
      setLoading(false);
      setAval(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getAval(id);
      setAval(res.data);
    } catch (err: any) {
      setError(err?.message ?? "No se pudo cargar el aval.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchAval();
  }, [fetchAval]);

  const handleCancel = async () => {
    if (!aval) return;
    try {
      setCancelling(true);
      router.push("/avales?status=cancelled");
    } catch (err: any) {
      setError(err?.message ?? "No se pudo cancelar el aval.");
      setConfirmOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const handleApprove = useCallback(async () => {
    if (!aval) return;
    if (!user?.id) {
      setActionError("No se pudo identificar el usuario.");
      return;
    }

    setActionError(null);
    setActionLoading(true);
    try {
      await aprobarAval(aval.id, user.id, approvalEtapa);
      setToast({ variant: "success", message: "Aval aprobado correctamente." });
      await fetchAval();
    } catch (err: any) {
      setActionError(err?.message ?? "No se pudo aprobar el aval.");
    } finally {
      setActionLoading(false);
    }
  }, [aval, user?.id, approvalEtapa, fetchAval]);

  const handleReject = useCallback(async () => {
    if (!aval) return;
    if (!user?.id) {
      setActionError("No se pudo identificar el usuario.");
      return;
    }
    if (!rechazoMotivo.trim()) {
      setActionError("Debes indicar un motivo para el rechazo.");
      return;
    }

    setActionError(null);
    setActionLoading(true);
    try {
      await rechazarAval(aval.id, user.id, currentEtapa, rechazoMotivo.trim());
      setToast({
        variant: "success",
        message: "Aval rechazado correctamente.",
      });
      setRechazoMotivo("");
      await fetchAval();
    } catch (err: any) {
      setActionError(err?.message ?? "No se pudo rechazar el aval.");
    } finally {
      setActionLoading(false);
    }
  }, [aval, user?.id, rechazoMotivo, currentEtapa, fetchAval]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
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
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
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
    ? (evento.numEntrenadoresHombres || 0) +
      (evento.numEntrenadoresMujeres || 0)
    : 0;

  const totalPresupuesto = evento
    ? evento.presupuesto.reduce((sum, item) => {
        const valor = parseFloat(item.presupuesto) || 0;
        return sum + valor;
      }, 0)
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
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full drop-shadow-lg">
          <AlertBanner
            variant={toast.variant}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto space-y-8">
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
            {evento?.codigo && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Código del evento: {evento.codigo}
              </p>
            )}
          </div>

          {/* Botón de crear solicitud si está en borrador */}
          {aval.estado === "BORRADOR" && (
            <Link
              href={`/avales/${aval.id}/crear-solicitud`}
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Crear solicitud
            </Link>
          )}
        </div>

        {/* Estado del aval */}
        <div
          className={`rounded-xl p-6 ${statusStyles.bg} border ${
            aval.estado === "BORRADOR"
              ? "border-orange-200 dark:border-orange-800/40"
              : aval.estado === "SOLICITADO"
                ? "border-amber-200 dark:border-amber-800/40"
                : aval.estado === "ACEPTADO"
                  ? "border-green-200 dark:border-green-800/40"
                  : "border-rose-200 dark:border-rose-800/40"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <StatusIcon className={`w-6 h-6 ${statusStyles.text}`} />
            <h2 className={`text-lg font-semibold ${statusStyles.text}`}>
              {aval.estado === "BORRADOR"
                ? "Sin solicitud creada"
                : aval.estado === "SOLICITADO"
                  ? "Solicitud Pendiente"
                  : aval.estado === "ACEPTADO"
                    ? "Aval Aprobado"
                    : "Solicitud Rechazada"}
            </h2>
          </div>

          {aval.estado === "BORRADOR" ? (
            <div className="text-sm">
              <p className={`${statusStyles.text}`}>
                La convocatoria fue subida exitosamente. Para continuar con el
                proceso de solicitud de aval, necesitas crear el aval técnico
                con la información de deportistas, objetivos, criterios y
                presupuesto.
              </p>
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Fecha de creación
                </p>
                <p className={`font-medium ${statusStyles.text}`}>
                  {formatDate(aval.createdAt)}
                </p>
              </div>
              {aval.convocatoriaUrl && (
                <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-700">
                  <a
                    href={aval.convocatoriaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Ver convocatoria subida
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                    Fecha de solicitud
                  </p>
                  <p className={`font-medium ${statusStyles.text}`}>
                    {formatDate(aval.createdAt)}
                  </p>
                </div>
                {aval.updatedAt && aval.createdAt !== aval.updatedAt && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Última actualización
                    </p>
                    <p className={`font-medium ${statusStyles.text}`}>
                      {formatDate(aval.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
              {aval.comentario && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 font-medium">
                    {aval.estado === "RECHAZADO"
                      ? "Motivo de rechazo"
                      : "Comentarios"}
                  </p>
                  <p className={`${statusStyles.text}`}>{aval.comentario}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Información del evento */}
        {evento && (
          <>
            <div className="flex items-center gap-2 pt-2">
              <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Información del Evento
              </h2>
            </div>

            {/* Nombre del evento y badges */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {evento.nombre}
                  </h3>
                  {evento.codigo && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Código: {evento.codigo}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                    {evento.tipoEvento}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    {evento.tipoParticipacion}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm">
                  <Tag className="w-4 h-4" />
                  {evento.disciplina.nombre}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm">
                  <Trophy className="w-4 h-4" />
                  {evento.categoria.nombre}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm">
                  <Globe className="w-4 h-4" />
                  {evento.alcance}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm">
                  <Users className="w-4 h-4" />
                  {formatGenero(evento.genero)}
                </span>
              </div>
            </div>

            {/* Tarjetas de información */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Fechas */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Fechas del Evento
                  </h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Fecha de inicio
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {formatDate(evento.fechaInicio)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Fecha de fin
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {formatDate(evento.fechaFin)}
                    </p>
                  </div>
                  {duration && (
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 mb-1">
                        Duración
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                        {duration} {duration === 1 ? "día" : "días"}
                      </p>
                    </div>
                  )}
                  {daysUntil !== null && daysUntil >= 0 && (
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-200 dark:border-indigo-700">
                        <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
                          {daysUntil === 0
                            ? "¡El evento es hoy!"
                            : daysUntil === 1
                              ? "El evento es mañana"
                              : `Faltan ${daysUntil} días`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/30">
                    <MapPin className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Ubicación
                  </h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Lugar
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {evento.lugar || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Ciudad
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {evento.ciudad || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Provincia
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {evento.provincia || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      País
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {evento.pais || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Participantes */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Participantes
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {evento.numAtletasHombres || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Atletas (H)
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800">
                    <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                      {evento.numAtletasMujeres || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Atletas (M)
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                      {evento.numEntrenadoresHombres || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Entrenadores (H)
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {evento.numEntrenadoresMujeres || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Entrenadores (M)
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {totalAtletas}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Total Atletas
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {totalEntrenadores}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Total Entrenadores
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Presupuesto */}
            {evento.presupuesto && evento.presupuesto.length > 0 && (
              <>
                <div className="flex items-center gap-2 pt-4">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Presupuesto del Evento
                  </h2>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Presupuesto Total
                        </p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                          {formatCurrency(totalPresupuesto)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Items Presupuestarios
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                          {evento.presupuesto.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      {evento.presupuesto.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {item.item.nombre}
                            </h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                              <span className="inline-flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                Item #{item.item.numero}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {item.item.actividad.nombre}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatMes(item.mes)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-green-700 dark:text-green-300">
                              {formatCurrency(parseFloat(item.presupuesto))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Aval Técnico */}
            {aval.avalTecnico && (
              <>
                <div className="flex items-center gap-2 pt-4">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Aval Técnico
                  </h2>
                </div>

                {/* Logística */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                      <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Información de Viaje
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Salida
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                        {formatDateTime(aval.avalTecnico.fechaHoraSalida)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {aval.avalTecnico.transporteSalida}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Retorno
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                        {formatDateTime(aval.avalTecnico.fechaHoraRetorno)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {aval.avalTecnico.transporteRetorno}
                      </p>
                    </div>
                  </div>

                  {aval.avalTecnico.observaciones && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Observaciones
                      </p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {aval.avalTecnico.observaciones}
                      </p>
                    </div>
                  )}
                </div>

                {/* Objetivos y Criterios */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Objetivos */}
                  {aval.avalTecnico.objetivos &&
                    aval.avalTecnico.objetivos.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            Objetivos
                          </h3>
                        </div>
                        <ol className="space-y-3">
                          {aval.avalTecnico.objetivos
                            .sort((a, b) => a.orden - b.orden)
                            .map((objetivo) => (
                              <li
                                key={objetivo.id}
                                className="flex gap-3 text-sm text-gray-700 dark:text-gray-300"
                              >
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold text-xs">
                                  {objetivo.orden}
                                </span>
                                <span className="flex-1 pt-0.5">
                                  {objetivo.descripcion}
                                </span>
                              </li>
                            ))}
                        </ol>
                      </div>
                    )}

                  {/* Criterios */}
                  {aval.avalTecnico.criterios &&
                    aval.avalTecnico.criterios.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                            <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            Criterios de Selección
                          </h3>
                        </div>
                        <ol className="space-y-3">
                          {aval.avalTecnico.criterios
                            .sort((a, b) => a.orden - b.orden)
                            .map((criterio) => (
                              <li
                                key={criterio.id}
                                className="flex gap-3 text-sm text-gray-700 dark:text-gray-300"
                              >
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold text-xs">
                                  {criterio.orden}
                                </span>
                                <span className="flex-1 pt-0.5">
                                  {criterio.descripcion}
                                </span>
                              </li>
                            ))}
                        </ol>
                      </div>
                    )}
                </div>

                {/* Deportistas */}
                {aval.avalTecnico.deportistasAval &&
                  aval.avalTecnico.deportistasAval.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Deportistas Seleccionados (
                          {aval.avalTecnico.deportistasAval.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {aval.avalTecnico.deportistasAval.map((deportista) => (
                          <div
                            key={deportista.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                Deportista #{deportista.deportistaId}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {deportista.rol}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}
          </>
        )}
        {showApprovalPanel && (
          <ApprovalFlowCard
            title="Este aval necesita aprobación"
            summaryLines={summaryLines}
            currentStageLabel={arrowCurrentLabel}
            nextStageLabel={arrowNextLabel}
            reasonValue={rechazoMotivo}
            onReasonChange={setRechazoMotivo}
            actionError={actionError}
            actionLoading={actionLoading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
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
