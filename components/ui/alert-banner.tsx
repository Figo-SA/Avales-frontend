"use client";

import { JSX } from "react";

type Variant = "success" | "error";

type Props = {
  variant: Variant;
  message: string;
  description?: string;
  onClose?: () => void;
};

const variants: Record<
  Variant,
  { container: string; text: string; icon: JSX.Element }
> = {
  success: {
    container:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-800/70 dark:bg-emerald-900/30",
    text: "text-emerald-800 dark:text-emerald-100",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l1.999 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    container:
      "border-rose-200 bg-rose-50 dark:border-rose-800/70 dark:bg-rose-900/30",
    text: "text-rose-800 dark:text-rose-100",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export default function AlertBanner({
  variant,
  message,
  description,
  onClose,
}: Props) {
  const styles = variants[variant];

  return (
    <div
      className={`rounded-sm border px-4 py-3 flex items-start justify-between ${styles.container}`}
    >
      <div className="flex items-start space-x-3">
        <span className={styles.text}>{styles.icon}</span>
        <div>
          <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
          {description && (
            <p className={`text-xs ${styles.text} opacity-80`}>{description}</p>
          )}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`${styles.text} hover:opacity-80`}
          aria-label="Cerrar alerta"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
