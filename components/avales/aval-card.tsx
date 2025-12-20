"use client";

import Link from "next/link";
import { FileCheck, Calendar, User, Users } from "lucide-react";
import type { Aval } from "@/types/aval";
import AvalStatusBadge from "./aval-status-badge";

type Props = {
  aval: Aval;
  href: string;
  showEntrenador?: boolean;
};

export default function AvalCard({ aval, href, showEntrenador = false }: Props) {
  const fechaCreacion = new Date(aval.createdAt).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-violet-500" />
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {aval.codigo}
          </span>
        </div>
        <AvalStatusBadge status={aval.status} size="sm" />
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {/* Disciplina y Categoría */}
        <div className="flex items-center gap-4">
          {aval.disciplina && (
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
              {aval.disciplina.nombre}
            </span>
          )}
          {aval.categoria && (
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
              {aval.categoria.nombre}
            </span>
          )}
        </div>

        {/* Deportistas */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            {aval.deportistas?.length || 0} deportista
            {(aval.deportistas?.length || 0) !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Entrenador (opcional) */}
        {showEntrenador && aval.entrenador && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>
              {aval.entrenador.nombre} {aval.entrenador.apellido}
            </span>
          </div>
        )}

        {/* Fecha */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{fechaCreacion}</span>
        </div>
      </div>

      {/* Observaciones si fue devuelto */}
      {aval.status === "DEVUELTO" && aval.observaciones && (
        <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs text-orange-700 dark:text-orange-300">
          <strong>Observaciones:</strong> {aval.observaciones}
        </div>
      )}
    </Link>
  );
}
