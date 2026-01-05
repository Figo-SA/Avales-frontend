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
  Pencil,
  Trash2,
  FileText,
  Clock,
  UserCheck,
} from "lucide-react";

import AlertBanner from "@/components/ui/alert-banner";
import ConfirmModal from "@/components/ui/confirm-modal";
import { getEvento, softDeleteEvento } from "@/lib/api/eventos";
import type { Evento } from "@/types/evento";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  DISPONIBLE: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
    dot: "bg-green-500",
  },
  SOLICITADO: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  RECHAZADO: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  ACEPTADO: {
    bg: "bg-sky-50 dark:bg-sky-900/20",
    text: "text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
};

function getStatusStyles(status?: string | null) {
  if (!status)
    return {
      bg: "bg-gray-50 dark:bg-gray-800/50",
      text: "text-gray-700 dark:text-gray-300",
      dot: "bg-gray-400",
    };
  return (
    STATUS_STYLES[status.toUpperCase()] ?? {
      bg: "bg-gray-50 dark:bg-gray-800/50",
      text: "text-gray-700 dark:text-gray-300",
      dot: "bg-gray-400",
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

function formatLocation(evento: Evento) {
  const parts = [evento.lugar, evento.ciudad, evento.provincia, evento.pais].filter(
    Boolean
  );
  return parts.length ? parts.join(", ") : "-";
}

function getDaysUntilEvent(fechaInicio?: string | null) {
  if (!fechaInicio) return null;
  const start = new Date(fechaInicio);
  if (Number.isNaN(start.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function getEventDuration(fechaInicio?: string | null, fechaFin?: string | null) {
  if (!fechaInicio || !fechaFin) return null;
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
}

export default function EventoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("ID de evento inválido");
      setLoading(false);
      return;
    }

    async function fetchEvento() {
      try {
        setLoading(true);
        const res = await getEvento(id);
        setEvento(res.data);
      } catch (err: any) {
        setError(err?.message ?? "No se pudo cargar el evento.");
      } finally {
        setLoading(false);
      }
    }

    void fetchEvento();
  }, [id]);

  const handleDelete = async () => {
    if (!evento) return;
    try {
      setDeleting(true);
      await softDeleteEvento(evento.id);
      router.push("/eventos?status=deleted");
    } catch (err: any) {
      setError(err?.message ?? "No se pudo eliminar el evento.");
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
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

  if (error || !evento) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto">
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl p-6 text-center">
          {error ?? "Evento no encontrado"}
        </div>
        <div className="mt-4">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a eventos
          </Link>
        </div>
      </div>
    );
  }

  const statusStyles = getStatusStyles(evento.estado);
  const daysUntil = getDaysUntilEvent(evento.fechaInicio);
  const duration = getEventDuration(evento.fechaInicio, evento.fechaFin);

  const totalAtletas = (evento.numAtletasHombres || 0) + (evento.numAtletasMujeres || 0);
  const totalEntrenadores =
    (evento.numEntrenadoresHombres || 0) + (evento.numEntrenadoresMujeres || 0);

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full drop-shadow-lg">
          <AlertBanner variant="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a eventos
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {evento.nombre}
            </h1>
            {evento.codigo && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Código: {evento.codigo}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/eventos/${evento.id}/editar`}
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="btn bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </button>
          </div>
        </div>

        {/* Estado y badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusStyles.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusStyles.dot}`} />
            <span className={`font-medium ${statusStyles.text}`}>
              {evento.estado || "Sin estado"}
            </span>
          </div>
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

        {/* Tarjetas de información principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Fechas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Fechas</h3>
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
                  <p className="text-gray-500 dark:text-gray-400">Duración</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {duration} {duration === 1 ? "día" : "días"}
                  </p>
                </div>
              )}
              {daysUntil !== null && daysUntil >= 0 && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-amber-700 dark:text-amber-300 font-medium text-sm">
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
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ubicación</h3>
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
                <p className="text-gray-500 dark:text-gray-400">Provincia</p>
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
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Clasificación
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Disciplina</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {evento.disciplina?.nombre || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Categoría</p>
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

        {/* Participantes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
              <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Participantes
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Atletas Hombres */}
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {evento.numAtletasHombres || 0}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Atletas (H)
              </p>
            </div>

            {/* Atletas Mujeres */}
            <div className="text-center p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20">
              <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                {evento.numAtletasMujeres || 0}
              </p>
              <p className="text-sm text-pink-700 dark:text-pink-300 mt-1">
                Atletas (M)
              </p>
            </div>

            {/* Entrenadores Hombres */}
            <div className="text-center p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {evento.numEntrenadoresHombres || 0}
              </p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                Entrenadores (H)
              </p>
            </div>

            {/* Entrenadores Mujeres */}
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {evento.numEntrenadoresMujeres || 0}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                Entrenadores (M)
              </p>
            </div>
          </div>

          {/* Totales */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalAtletas}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Atletas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalEntrenadores}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Entrenadores
              </p>
            </div>
          </div>
        </div>

        {/* Archivo adjunto */}
        {evento.archivo && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Archivo adjunto
              </h3>
            </div>
            <a
              href={evento.archivo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <FileText className="w-4 h-4" />
              Ver archivo
            </a>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar evento"
        description={`¿Seguro que quieres eliminar el evento "${evento.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (deleting) return;
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
