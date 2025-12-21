"use client";

import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import AvalStatusBadgeV2, { type AvalStatusV2 } from "./aval-status-badge-v2";

export type AvalListItemData = {
  id: number;
  codigo: string;
  disciplina: string;
  rol: string;
  fecha: string;
  estado: AvalStatusV2;
};

type Props = {
  aval: AvalListItemData;
  href?: string;
};

export default function AvalListItem({ aval, href }: Props) {
  const fechaFormateada = new Date(aval.fecha).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const content = (
    <div className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all duration-200">
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {aval.codigo}
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
          {aval.disciplina}
        </p>
      </div>

      {/* Rol Badge */}
      <div className="hidden sm:block">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {aval.rol}
        </span>
      </div>

      {/* Date */}
      <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400 min-w-[100px] text-right">
        {fechaFormateada}
      </div>

      {/* Status */}
      <div className="flex-shrink-0">
        <AvalStatusBadgeV2 status={aval.estado} size="sm" />
      </div>

      {/* Action Arrow */}
      <div className="flex-shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
