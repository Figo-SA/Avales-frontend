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
  User,
  Users,
  FileText,
} from "lucide-react";
import { getAval, deleteAval, enviarAval } from "@/lib/api/aval";
import type { Aval } from "@/types/aval";
import AvalStatusBadge from "@/components/avales/aval-status-badge";
import ConfirmModal from "@/components/ui/confirm-modal";

export default function VerAvalPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const avalId = Number(params?.id);

  const [aval, setAval] = useState<Aval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleEnviar = async () => {
    if (!aval) return;
    setActionLoading(true);
    try {
      await enviarAval(aval.id);
      router.push("/mis-avales?status=success");
    } catch (err: any) {
      setError(err?.message ?? "Error al enviar el aval");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!aval) return;
    setActionLoading(true);
    try {
      await deleteAval(aval.id);
      router.push("/mis-avales?status=deleted");
    } catch (err: any) {
      setError(err?.message ?? "Error al eliminar el aval");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const canEdit = aval?.status === "BORRADOR" || aval?.status === "DEVUELTO";
  const canSend = aval?.status === "BORRADOR" || aval?.status === "DEVUELTO";
  const canDelete = aval?.status === "BORRADOR";

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
            href="/mis-avales"
            className="btn bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            Volver a mis avales
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
          href="/mis-avales"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a mis avales
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                {aval.codigo}
              </h1>
              <AvalStatusBadge status={aval.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Creado el {formatDate(aval.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <Link
                href={`/mis-avales/${aval.id}/editar`}
                className="btn bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Link>
            )}
            {canSend && (
              <button
                onClick={handleEnviar}
                disabled={actionLoading}
                className="btn bg-violet-500 text-white hover:bg-violet-600 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {actionLoading ? "Enviando..." : "Enviar"}
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

      {/* Observaciones si fue devuelto */}
      {aval.status === "DEVUELTO" && aval.observaciones && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
            Observaciones del revisor
          </h3>
          <p className="text-sm text-orange-600 dark:text-orange-300">
            {aval.observaciones}
          </p>
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

          {aval.fechaEnvio && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fecha de envío
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {formatDate(aval.fechaEnvio)}
                </p>
              </div>
            </div>
          )}

          {aval.fechaAprobacion && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fecha de aprobación
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {formatDate(aval.fechaAprobacion)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deportistas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        open={showDeleteModal}
        title="Eliminar Aval"
        description="¿Estás seguro de que deseas eliminar este aval? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
