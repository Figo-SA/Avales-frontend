"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Send,
  Trash2,
  Calendar,
  MapPin,
  Users,
  FileText,
} from "lucide-react";
import { getEvento, deleteEvento, solicitarAval } from "@/lib/api/evento";
import type { Evento } from "@/types/evento";
import AvalStatusBadge from "@/components/avales/aval-status-badge";
import ConfirmModal from "@/components/ui/confirm-modal";

export default function VerEventoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventoId = Number(params?.id);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!params?.id || Number.isNaN(eventoId)) {
      setError("ID de evento inválido");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const res = await getEvento(eventoId);
        setEvento(res.data ?? null);
        if (!res.data) {
          setError("Evento no encontrado");
        }
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar el evento");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [params?.id, eventoId]);

  const handleSolicitarAval = async () => {
    if (!evento) return;
    setActionLoading(true);
    try {
      // Solicitar aval con datos mínimos
      await solicitarAval(evento.id, {
        fechaHoraSalida: evento.fechaInicio,
        fechaHoraRetorno: evento.fechaFin,
        transporteSalida: "Por definir",
        transporteRetorno: "Por definir",
        objetivos: [{ orden: 1, descripcion: "Participación en el evento" }],
        criterios: [{ orden: 1, descripcion: "Criterio de selección" }],
        rubros: [],
        deportistas: [],
        entrenadores: [],
      });
      router.push("/mis-avales?status=success");
    } catch (err: any) {
      setError(err?.message ?? "Error al solicitar el aval");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!evento) return;
    setActionLoading(true);
    try {
      await deleteEvento(evento.id);
      router.push("/mis-avales?status=deleted");
    } catch (err: any) {
      setError(err?.message ?? "Error al eliminar el evento");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const canEdit = evento?.estado === "DISPONIBLE";
  const canSolicitarAval = evento?.estado === "DISPONIBLE";
  const canDelete = evento?.estado === "DISPONIBLE";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
        Cargando evento...
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error ?? "Evento no encontrado"}</p>
          <Link
            href="/mis-avales"
            className="btn bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            Volver a mis eventos
          </Link>
        </div>
      </div>
    );
  }

  const totalAtletas = evento.numAtletasHombres + evento.numAtletasMujeres;
  const totalEntrenadores = evento.numEntrenadoresHombres + evento.numEntrenadoresMujeres;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/mis-avales"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a mis eventos
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                {evento.codigo}
              </h1>
              <AvalStatusBadge status={evento.estado} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {evento.nombre}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <Link
                href={`/mis-avales/${evento.id}/editar`}
                className="btn bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Link>
            )}
            {canSolicitarAval && (
              <button
                onClick={handleSolicitarAval}
                disabled={actionLoading}
                className="btn bg-violet-500 text-white hover:bg-violet-600 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {actionLoading ? "Solicitando..." : "Solicitar Aval"}
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comentario si fue rechazado */}
      {evento.estado === "RECHAZADO" && evento.coleccion?.comentario && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">
            Motivo del rechazo
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            {evento.coleccion.comentario}
          </p>
        </div>
      )}

      {/* Información del evento */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Información del Evento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tipo de Evento
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {evento.tipoEvento}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tipo de Participación
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {evento.tipoParticipacion}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Disciplina
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {evento.disciplina?.nombre ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Categoría
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {evento.categoria?.nombre ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ubicación
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {evento.lugar}, {evento.ciudad}, {evento.provincia}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Alcance
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {evento.alcance}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fecha de Inicio
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {formatDate(evento.fechaInicio)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fecha de Fin
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {formatDate(evento.fechaFin)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Participantes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Participantes
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {evento.numAtletasHombres}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Atletas Hombres
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {evento.numAtletasMujeres}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Atletas Mujeres
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {evento.numEntrenadoresHombres}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Entrenadores Hombres
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {evento.numEntrenadoresMujeres}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Entrenadoras Mujeres
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Total:</strong> {totalAtletas} atletas y {totalEntrenadores} entrenadores
          </p>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        open={showDeleteModal}
        title="Eliminar Evento"
        description="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
