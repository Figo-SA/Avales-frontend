"use client";

import type { Evento } from "@/types/evento";

type Props = {
  eventos: Evento[];
  loading?: boolean;
  error?: string | null;
};

const COLUMN_COUNT = 9;

const STATUS_STYLES: Record<string, string> = {
  DISPONIBLE:
    "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200",
  SOLICITADO:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  RECHAZADO:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
  ACEPTADO:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200",
};

function getStatusClasses(status?: string | null) {
  if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200";
  return STATUS_STYLES[status.toUpperCase()] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200";
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function formatLocation(evento: Evento) {
  const parts = [
    evento.lugar,
    evento.ciudad,
    evento.provincia,
    evento.pais,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
}

export default function EventoTable({ eventos, loading, error }: Props) {
  const showEmpty = !loading && !error && eventos.length === 0;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Eventos{" "}
          <span className="text-gray-400 dark:text-gray-500 font-medium">
            {eventos.length}
          </span>
        </h2>
      </header>
      <div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Nombre</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Tipo de evento</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Participación</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Disciplina</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Categoría</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Lugar</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Fecha inicio</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Fecha fin</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Estado</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {loading && (
                <tr>
                  <td
                    className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400"
                    colSpan={COLUMN_COUNT}
                  >
                    Cargando eventos...
                  </td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td
                    className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap text-center text-red-500"
                    colSpan={COLUMN_COUNT}
                  >
                    {error}
                  </td>
                </tr>
              )}

              {showEmpty && (
                <tr>
                  <td
                    className="px-2 first:pl-5 last:pr-5 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400"
                    colSpan={COLUMN_COUNT}
                  >
                    No hay eventos registrados.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                eventos.map((evento) => (
                  <tr key={evento.id}>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {evento.nombre || "-"}
                      </div>
                      {evento.codigo && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {evento.codigo}
                        </div>
                      )}
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {evento.tipoEvento || "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {evento.tipoParticipacion || "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {evento.disciplina?.nombre || "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {evento.categoria?.nombre || "-"}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {formatLocation(evento)}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {formatDate(evento.fechaInicio)}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="text-gray-700 dark:text-gray-300">
                        {formatDate(evento.fechaFin)}
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${getStatusClasses(
                            evento.estado
                          )}`}
                        >
                          {evento.estado || "Desconocido"}
                        </span>
                        {evento.alcance && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {evento.alcance}
                          </span>
                        )}
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
