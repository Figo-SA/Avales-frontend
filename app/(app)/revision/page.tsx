"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClipboardCheck, Inbox } from "lucide-react";
import { listAvalesPendientes } from "@/lib/api/aval";
import type { Aval } from "@/types/aval";
import AvalCard from "@/components/avales/aval-card";
import AlertBanner from "@/components/ui/alert-banner";

export default function RevisionPage() {
  const searchParams = useSearchParams();
  const [avales, setAvales] = useState<Aval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(
    searchParams.get("status") === "success"
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await listAvalesPendientes();
        setAvales(res.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar avales pendientes");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-violet-500" />
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Bandeja de Revisión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Avales pendientes de tu aprobación
            </p>
          </div>
        </div>
      </div>

      {/* Alert de éxito */}
      {showSuccess && (
        <div className="mb-6">
          <AlertBanner
            variant="success"
            message="Acción realizada correctamente"
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Cargando avales pendientes...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {/* Lista de avales */}
      {!loading && !error && (
        <>
          {avales.length === 0 ? (
            <div className="text-center py-16">
              <Inbox className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                No hay avales pendientes
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Cuando haya avales por revisar, aparecerán aquí
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 px-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {avales.length} aval{avales.length !== 1 ? "es" : ""} pendiente
                  {avales.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {avales.map((aval) => (
                  <AvalCard
                    key={aval.id}
                    aval={aval}
                    href={`/revision/${aval.id}`}
                    showEntrenador
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
