"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, RotateCcw } from "lucide-react";
import { aprobarAval, devolverAval, rechazarAval } from "@/lib/api/aval";
import type { Aval } from "@/types/aval";

type Props = {
  aval: Aval;
  onSuccess?: () => void;
};

type Action = "aprobar" | "devolver" | "rechazar" | null;

export default function RevisionPanel({ aval, onSuccess }: Props) {
  const router = useRouter();
  const [action, setAction] = useState<Action>(null);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    if (!action) return;

    if ((action === "devolver" || action === "rechazar") && !observaciones.trim()) {
      setError("Las observaciones son obligatorias");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      switch (action) {
        case "aprobar":
          await aprobarAval(aval.id, observaciones || undefined);
          break;
        case "devolver":
          await devolverAval(aval.id, observaciones);
          break;
        case "rechazar":
          await rechazarAval(aval.id, observaciones);
          break;
      }

      onSuccess?.();
      router.push("/revision?status=success");
    } catch (err: any) {
      setError(err?.message ?? "Error al procesar la acción");
    } finally {
      setLoading(false);
    }
  };

  const canReview = aval.status === "ENVIADO" || aval.status === "EN_REVISION";

  if (!canReview) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
        Este aval no está disponible para revisión
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Acciones de Revisión
      </h3>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setAction("aprobar")}
          className={`btn flex items-center gap-2 ${
            action === "aprobar"
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          <Check className="w-4 h-4" />
          Aprobar
        </button>
        <button
          type="button"
          onClick={() => setAction("devolver")}
          className={`btn flex items-center gap-2 ${
            action === "devolver"
              ? "bg-orange-500 text-white"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Devolver
        </button>
        <button
          type="button"
          onClick={() => setAction("rechazar")}
          className={`btn flex items-center gap-2 ${
            action === "rechazar"
              ? "bg-red-500 text-white"
              : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          <X className="w-4 h-4" />
          Rechazar
        </button>
      </div>

      {/* Observaciones (obligatorias para devolver/rechazar) */}
      {action && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium">
            Observaciones{" "}
            {(action === "devolver" || action === "rechazar") && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <textarea
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder={
              action === "aprobar"
                ? "Observaciones opcionales..."
                : "Indica el motivo de la devolución/rechazo..."
            }
            className="form-textarea w-full"
          />

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setAction(null);
                setObservaciones("");
                setError(null);
              }}
              className="btn border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAction}
              disabled={loading}
              className={`btn text-white ${
                action === "aprobar"
                  ? "bg-green-500 hover:bg-green-600"
                  : action === "devolver"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading
                ? "Procesando..."
                : action === "aprobar"
                ? "Confirmar Aprobación"
                : action === "devolver"
                ? "Confirmar Devolución"
                : "Confirmar Rechazo"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
