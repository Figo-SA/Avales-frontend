"use client";

import type { Deportista } from "@/types/deportista";

type Props = {
  deportistas: Deportista[];
  loading?: boolean;
  error?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function formatGenero(genero?: string | null) {
  if (!genero) return "-";
  const upper = genero.toUpperCase();
  if (upper === "M" || upper === "MASCULINO") return "Masculino";
  if (upper === "F" || upper === "FEMENINO") return "Femenino";
  if (upper === "O" || upper === "OTRO") return "Otro";
  return genero;
}

function formatAfiliacion(d: Deportista) {
  if (!d.afiliacion) return "No afiliado";
  if (d.afiliacionFin) {
    return `Vigente hasta ${formatDate(d.afiliacionFin)}`;
  }
  return "Vigente";
}

export default function DeportistaTable({
  deportistas,
  loading,
  error,
}: Props) {
  const showEmpty = !loading && !error && deportistas.length === 0;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Deportistas{" "}
          <span className="text-gray-400 dark:text-gray-500 font-medium">
            {deportistas.length}
          </span>
        </h2>
      </header>
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Nombres</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Apellidos</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Cedula</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Categoria</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Disciplina</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Genero</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Afiliacion</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {loading && (
                <tr>
                  <td
                    className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400"
                    colSpan={7}
                  >
                    Cargando deportistas...
                  </td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td
                    className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap text-center text-red-500"
                    colSpan={7}
                  >
                    {error}
                  </td>
                </tr>
              )}

              {showEmpty && (
                <tr>
                  <td
                    className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400"
                    colSpan={7}
                  >
                    No hay deportistas para mostrar.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                deportistas.map((d) => (
                  <tr key={d.id}>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {d.nombres || "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {d.apellidos || "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {d.cedula || "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {d.categoria?.nombre ?? "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {d.disciplina?.nombre ?? "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {formatGenero(d.genero)}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {formatAfiliacion(d)}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
