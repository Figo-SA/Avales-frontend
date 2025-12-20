"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Users,
  FileText,
} from "lucide-react";
import { getAval } from "@/lib/api/aval";
import type { Aval } from "@/types/aval";
import AvalStatusBadge from "@/components/avales/aval-status-badge";
import RevisionPanel from "@/components/avales/revision-panel";

export default function RevisarAvalPage() {
  const params = useParams<{ id: string }>();
  const avalId = Number(params?.id);

  const [aval, setAval] = useState<Aval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id || Number.isNaN(avalId)) {
      setError("ID de aval inválido");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const res = await getAval(avalId);
        setAval(res.data ?? null);
        if (!res.data) {
          setError("Aval no encontrado");
        }
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar el aval");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [params?.id, avalId]);

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
        Cargando aval...
      </div>
    );
  }

  if (error || !aval) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error ?? "Aval no encontrado"}</p>
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
                Revisar: {aval.codigo}
              </h1>
              <AvalStatusBadge status={aval.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enviado el {formatDate(aval.fechaEnvio ?? aval.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Información del entrenador */}
      {aval.entrenador && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Solicitado por
              </p>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                {aval.entrenador.nombre} {aval.entrenador.apellido}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información del aval */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Información del Aval
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Disciplina
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {aval.disciplina?.nombre ?? "—"}
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
                {aval.categoria?.nombre ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fecha de creación
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {formatDate(aval.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Deportistas
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {aval.deportistas?.length ?? 0} incluido
                {(aval.deportistas?.length ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {aval.observaciones && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Observaciones del solicitante
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {aval.observaciones}
            </p>
          </div>
        )}
      </div>

      {/* Deportistas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Deportistas ({aval.deportistas?.length ?? 0})
          </h2>
        </div>

        {aval.deportistas && aval.deportistas.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {aval.deportistas.map((d) => (
              <li key={d.id} className="py-3 flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {d.user?.nombre} {d.user?.apellido}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    CI: {d.cedula} • {d.disciplina?.nombre} • {d.categoria?.nombre}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No hay deportistas asignados
          </p>
        )}
      </div>

      {/* Panel de revisión */}
      <RevisionPanel aval={aval} />
    </div>
  );
}
