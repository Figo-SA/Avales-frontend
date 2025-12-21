"use client";

import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { listMisDeportistas } from "@/lib/api/deportista";
import type { Deportista } from "@/types/deportista";
import { useAuth } from "@/app/providers/auth-provider";

export default function MisDeportistasPage() {
  const { user, loading: authLoading } = useAuth();
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      try {
        setLoading(true);
        // Filtrar por la disciplina del entrenador si existe
        const disciplinaId = user?.disciplina?.id;
        const res = await listMisDeportistas(disciplinaId ? { disciplinaId } : undefined);
        setDeportistas(res.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar deportistas");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [authLoading, user?.disciplina?.id]);

  const filteredDeportistas = deportistas.filter((d) => {
    const fullName = `${d.user?.nombre ?? ""} ${d.user?.apellido ?? ""} ${d.cedula}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Mis Deportistas
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Deportistas asignados a tu cargo
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input w-full pl-10"
          />
        </div>
      </div>

      {/* Loading */}
      {(loading || authLoading) && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Cargando deportistas...
        </div>
      )}

      {/* Error */}
      {error && !loading && !authLoading && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {/* Lista */}
      {!loading && !authLoading && !error && (
        <>
          {filteredDeportistas.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {search
                ? "No se encontraron deportistas"
                : "No tienes deportistas asignados"}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Deportista
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cédula
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Disciplina
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredDeportistas.map((d) => (
                      <tr
                        key={d.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-100">
                                {d.user?.nombre} {d.user?.apellido}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {d.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {d.cedula}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {d.disciplina?.nombre ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {d.categoria?.nombre ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                              d.activo
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                          >
                            {d.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Total: {filteredDeportistas.length} deportista
            {filteredDeportistas.length !== 1 ? "s" : ""}
          </p>
        </>
      )}
    </div>
  );
}
