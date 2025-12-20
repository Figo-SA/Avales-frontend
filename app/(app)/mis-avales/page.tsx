"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { listMisAvales } from "@/lib/api/aval";
import type { Aval, AvalStatus } from "@/types/aval";
import AvalCard from "@/components/avales/aval-card";
import AlertBanner from "@/components/ui/alert-banner";

const STATUS_OPTIONS: { value: AvalStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "BORRADOR", label: "Borradores" },
  { value: "ENVIADO", label: "Enviados" },
  { value: "EN_REVISION", label: "En Revisión" },
  { value: "APROBADO", label: "Aprobados" },
  { value: "DEVUELTO", label: "Devueltos" },
  { value: "RECHAZADO", label: "Rechazados" },
];

export default function MisAvalesPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as AvalStatus | null;

  const [avales, setAvales] = useState<Aval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AvalStatus | "">(
    statusParam && STATUS_OPTIONS.some((o) => o.value === statusParam)
      ? statusParam
      : ""
  );
  const [showSuccess, setShowSuccess] = useState(
    searchParams.get("status") === "success"
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listMisAvales(
          filterStatus ? { status: filterStatus } : undefined
        );
        setAvales(res.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar los avales");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [filterStatus]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Mis Avales
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestiona tus solicitudes de avales deportivos
          </p>
        </div>

        <Link
          href="/mis-avales/nuevo"
          className="btn bg-violet-500 hover:bg-violet-600 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Aval
        </Link>
      </div>

      {/* Alert de éxito */}
      {showSuccess && (
        <div className="mb-6">
          <AlertBanner
            variant="success"
            message="Aval guardado correctamente"
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  filterStatus === option.value
                    ? "bg-violet-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Cargando avales...
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
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No tienes avales{filterStatus ? ` con estado "${filterStatus}"` : ""}
              </p>
              <Link
                href="/mis-avales/nuevo"
                className="btn bg-violet-500 hover:bg-violet-600 text-white inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear mi primer aval
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {avales.map((aval) => (
                <AvalCard
                  key={aval.id}
                  aval={aval}
                  href={`/mis-avales/${aval.id}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
