"use client";

import type { EventoStatus } from "@/types/evento";

type Props = {
  status: EventoStatus;
  size?: "sm" | "md";
};

const STATUS_CONFIG: Record<
  EventoStatus,
  { label: string; bg: string; text: string }
> = {
  DISPONIBLE: {
    label: "Disponible",
    bg: "bg-gray-100 dark:bg-gray-700",
    text: "text-gray-600 dark:text-gray-300",
  },
  SOLICITADO: {
    label: "Solicitado",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
  },
  ACEPTADO: {
    label: "Aceptado",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
  },
  RECHAZADO: {
    label: "Rechazado",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
  },
};

export default function AvalStatusBadge({ status, size = "md" }: Props) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.bg} ${config.text} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
