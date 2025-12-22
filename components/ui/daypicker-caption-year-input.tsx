"use client";

import * as React from "react";
import { MonthCaptionProps, useNavigation } from "react-day-picker";
import { es } from "date-fns/locale";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function CaptionYearInput(props: MonthCaptionProps) {
  const { calendarMonth } = props;
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  const monthDate = calendarMonth.date;
  const month = monthDate.getMonth();
  const currentYear = monthDate.getFullYear();

  // Rango permitido (ajústalo a tu gusto)
  const MIN_YEAR = 1970;
  const MAX_YEAR = 2100;

  const [yearText, setYearText] = React.useState(String(currentYear));

  React.useEffect(() => {
    setYearText(String(currentYear));
  }, [currentYear]);

  const monthLabel =
    es.localize?.month(month, { width: "wide" }) ?? String(month + 1);

  const commitYear = () => {
    const parsed = Number(yearText);
    if (!Number.isFinite(parsed)) {
      setYearText(String(currentYear));
      return;
    }
    const y = clamp(Math.trunc(parsed), MIN_YEAR, MAX_YEAR);
    goToMonth(new Date(y, month, 1));
  };

  return (
    <div className="flex items-center justify-between gap-2 px-2 py-2">
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
      >
        ‹
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium capitalize">{monthLabel}</span>

        {/* Año escribible */}
        <input
          value={yearText}
          onChange={(e) => setYearText(e.target.value)}
          onBlur={commitYear}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitYear();
            if (e.key === "Escape") setYearText(String(currentYear));
          }}
          inputMode="numeric"
          className="h-8 w-20 rounded-md border border-gray-200 bg-white px-2 text-sm dark:border-gray-700/60 dark:bg-gray-800"
        />
      </div>

      <button
        type="button"
        className="btn btn-sm"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
      >
        ›
      </button>
    </div>
  );
}
