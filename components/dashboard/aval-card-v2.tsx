"use client";

import Link from "next/link";
import { FileText, Calendar, Building2 } from "lucide-react";
import AvalStatusBadgeV2, { type AvalStatusV2 } from "./aval-status-badge-v2";

export type AvalCardData = {
  id: number;
  codigo: string;
  tipo: string;
  disciplina: string;
  rol?: string;
  fecha: string;
  estado: AvalStatusV2;
  descripcion?: string;
};

type Props = {
  aval: AvalCardData;
  href?: string;
  showPreview?: boolean;
};

export default function AvalCardV2({ aval, href, showPreview = true }: Props) {
  const fechaFormateada = new Date(aval.fecha).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const content = (
    <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-300">
      {/* Document Preview */}
      {showPreview && (
        <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
          {/* Mock Document Lines */}
          <div className="absolute inset-4 space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-3/4" />
            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-full opacity-60" />
            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-5/6 opacity-60" />
            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-4/6 opacity-60" />
            <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-600 rounded w-full opacity-40" />
            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-3/4 opacity-40" />
          </div>
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-300" />
          {/* Document Icon */}
          <div className="absolute bottom-3 right-3 w-8 h-8 bg-white dark:bg-slate-700 rounded-lg shadow-sm flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {aval.codigo}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
              {aval.tipo}
            </p>
          </div>
          <AvalStatusBadgeV2 status={aval.estado} size="sm" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {aval.disciplina}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {fechaFormateada}
          </span>
        </div>

        {/* Rol Badge */}
        {aval.rol && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {aval.rol}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}
