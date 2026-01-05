"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getDeportista } from "@/lib/api/deportistas";
import DeportistaForm from "../../_components/deportista-form";
import type { Deportista } from "@/types/deportista";

export default function EditarDeportista() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const deportistaId = useMemo(() => Number(params?.id), [params?.id]);
  const [deportista, setDeportista] = useState<Deportista | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id || Number.isNaN(deportistaId)) {
      setError("ID de deportista inválido.");
      setLoading(false);
      return;
    }

    const loadDeportista = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getDeportista(deportistaId);
        const found = res.data;
        if (!found) {
          throw new Error("Deportista no encontrado.");
        }
        setDeportista(found);
      } catch (err: any) {
        setError(err?.message ?? "No se pudo cargar el deportista.");
      } finally {
        setLoading(false);
      }
    };

    void loadDeportista();
  }, [params?.id, deportistaId]);

  const handleUpdated = async () => {
    router.push("/deportistas?status=updated");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Editar deportista
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Actualiza los datos personales y la informacion de afiliacion.
        </p>
      </div>

      {loading && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Cargando deportista...
        </div>
      )}

      {error && !loading && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && deportista && (
        <DeportistaForm
          mode="edit"
          deportista={deportista}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
