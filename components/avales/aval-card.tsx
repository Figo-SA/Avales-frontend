"use client";

import Link from "next/link";
import { FileCheck, Calendar, MapPin, Users } from "lucide-react";
import type { Evento } from "@/types/evento";
import AvalStatusBadge from "./aval-status-badge";

type Props = {
  evento: Evento;
  href: string;
};

export default function AvalCard({ evento, href }: Props) {
  const fechaInicio = new Date(evento.fechaInicio).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const totalAtletas = evento.numAtletasHombres + evento.numAtletasMujeres;
  const totalEntrenadores = evento.numEntrenadoresHombres + evento.numEntrenadoresMujeres;

  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-violet-500" />
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {evento.codigo}
          </span>
        </div>
        <AvalStatusBadge status={evento.estado} size="sm" />
      </div>

      <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
        {evento.nombre}
      </h3>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {/* Disciplina y Categoría */}
        <div className="flex items-center gap-4">
          {evento.disciplina && (
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
              {evento.disciplina.nombre}
            </span>
          )}
          {evento.categoria && (
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
              {evento.categoria.nombre}
            </span>
          )}
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{evento.lugar}, {evento.ciudad}</span>
        </div>

        {/* Participantes */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            {totalAtletas} atleta{totalAtletas !== 1 ? "s" : ""} • {totalEntrenadores} entrenador{totalEntrenadores !== 1 ? "es" : ""}
          </span>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{fechaInicio}</span>
        </div>
      </div>

      {/* Comentario si fue rechazado */}
      {evento.estado === "RECHAZADO" && evento.coleccion?.comentario && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-300">
          <strong>Motivo:</strong> {evento.coleccion.comentario}
        </div>
      )}
    </Link>
  );
}
