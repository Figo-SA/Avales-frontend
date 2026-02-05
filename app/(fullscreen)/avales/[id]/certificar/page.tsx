"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useAuth } from "@/app/providers/auth-provider";
import { getAval } from "@/lib/api/avales";
import type { Aval } from "@/types/aval";
import PdaPreview, { type PdaDraft } from "@/app/(app)/avales/_components/pda-preview";

const INITIAL_PDA_DRAFT: PdaDraft = {
  numeroPda: "",
  numeroAval: "",
  codigoActividad: "",
  nombreFirmante: "",
  cargoFirmante: "",
};

export default function CertificarAvalPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const avalId = Number(params.id);

  const [aval, setAval] = useState<Aval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<PdaDraft>(INITIAL_PDA_DRAFT);

  const isPda = user?.roles?.includes("PDA") ?? false;

  const loadAval = useCallback(async () => {
    if (!avalId || Number.isNaN(avalId)) {
      setError("ID de aval inválido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getAval(avalId);
      setAval(response.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo cargar el aval.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [avalId]);

  useEffect(() => {
    void loadAval();
  }, [loadAval]);

  const normalizedDraft = useMemo(
    () => ({
      ...draft,
      numeroPda: draft.numeroPda.trim(),
      numeroAval: draft.numeroAval.trim(),
      codigoActividad: draft.codigoActividad.trim(),
      nombreFirmante: draft.nombreFirmante.trim(),
      cargoFirmante: draft.cargoFirmante.trim(),
    }),
    [draft],
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cargando sesión...
          </p>
        </div>
      </div>
    );
  }

  if (!isPda) {
    return (
      <div className="px-6 py-8">
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl p-6 text-center">
          No tienes permisos para acceder a esta pantalla.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cargando información del aval...
          </p>
        </div>
      </div>
    );
  }

  if (error || !aval) {
    return (
      <div className="px-6 py-8">
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl p-6 text-center">
          {error || "No se encontró el aval."}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="h-full w-full overflow-y-auto">
          <div className="max-w-xl mx-auto px-6 sm:px-8 py-8">
            <button
              onClick={() => router.push("/avales")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>

            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Certificacion PDA
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Completa los datos del modelo PDA. El parrafo principal se agregara despues.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Numero PDA
                  </span>
                  <input
                    className="form-input w-full mt-1"
                    value={draft.numeroPda}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, numeroPda: e.target.value }))
                    }
                    placeholder="Ej: 136"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Numero Aval
                  </span>
                  <input
                    className="form-input w-full mt-1"
                    value={draft.numeroAval}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, numeroAval: e.target.value }))
                    }
                    placeholder="Ej: 012"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Codigo Actividad
                  </span>
                  <input
                    className="form-input w-full mt-1"
                    value={draft.codigoActividad}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, codigoActividad: e.target.value }))
                    }
                    placeholder="Ej: 005"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Documento PDF
                  </span>
                  <input
                    className="form-input w-full mt-1 opacity-60 cursor-not-allowed"
                    value="Pendiente de implementar"
                    disabled
                    readOnly
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre firmante
                  </span>
                  <input
                    className="form-input w-full mt-1"
                    value={draft.nombreFirmante}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, nombreFirmante: e.target.value }))
                    }
                    placeholder="Ej: Lic. Juan Perez"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cargo firmante
                  </span>
                  <input
                    className="form-input w-full mt-1"
                    value={draft.cargoFirmante}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, cargoFirmante: e.target.value }))
                    }
                    placeholder="Ej: Metodologo Provincial"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-slate-100 dark:bg-slate-900 overflow-y-auto">
        <div className="p-6 xl:p-8">
          <PdaPreview aval={aval} draft={normalizedDraft} />
        </div>
      </div>
    </div>
  );
}
