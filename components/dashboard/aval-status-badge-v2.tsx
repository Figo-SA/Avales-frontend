"use client";

export type AvalStatusV2 = "EN_PROCESO" | "APROBADO" | "RECHAZADO" | "ACTIVO";

type Props = {
  status: AvalStatusV2;
  size?: "sm" | "md" | "lg";
};

const STATUS_CONFIG: Record<
  AvalStatusV2,
  { label: string; bg: string; text: string; dot: string }
> = {
  EN_PROCESO: {
    label: "En Proceso",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  APROBADO: {
    label: "Aprobado",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  RECHAZADO: {
    label: "Rechazado",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  ACTIVO: {
    label: "Activo",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-700 dark:text-indigo-400",
    dot: "bg-indigo-500",
  },
};

export default function AvalStatusBadgeV2({ status, size = "md" }: Props) {
  const config = STATUS_CONFIG[status];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.bg} ${config.text} ${sizeClasses[size]}`}
    >
      <span className={`${dotSizes[size]} rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
