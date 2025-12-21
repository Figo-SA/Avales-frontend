"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  FileText,
} from "lucide-react";
import { getEvento } from "@/lib/api/evento";
import type { Evento } from "@/types/evento";
import AvalStatusBadge from "@/components/avales/aval-status-badge";
import RevisionPanel from "@/components/avales/revision-panel";

export default function RevisarEventoPage() {
  const params = useParams<{ id: string }>();
  const eventoId = Number(params?.id);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            href="/revision"
            className="btn bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            Volver a revisión
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
          href="/revision"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a bandeja de revisión
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Revisar: {evento.codigo}
              </h1>
              <AvalStatusBadge status={evento.estado} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {evento.nombre}
            </p>
          </div>
        </div>
      </div>

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
                {evento.lugar}, {evento.ciudad}
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

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Participantes
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {totalAtletas} atletas, {totalEntrenadores} entrenadores
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
        </div>
      </div>

      {/* Información del aval técnico si existe */}
      {evento.coleccion?.avalTecnico && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Información del Aval Técnico
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transporte de Salida
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {evento.coleccion.avalTecnico.transporteSalida}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transporte de Retorno
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {evento.coleccion.avalTecnico.transporteRetorno}
              </p>
            </div>
          </div>

          {evento.coleccion.avalTecnico.observaciones && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Observaciones
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {evento.coleccion.avalTecnico.observaciones}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Panel de revisión */}
      <RevisionPanel evento={evento} />
    </div>
  );
}
