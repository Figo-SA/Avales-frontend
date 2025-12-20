"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Popover } from "@headlessui/react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type DatePickerProps = {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
};

export default function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  disabled,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
}: DatePickerProps) {
  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  const [month, setMonth] = useState<Date>(() => selectedDate ?? new Date());

  // Importante: sincronizar el mes SOLO cuando cambia el value/selectedDate,
  // sin crear loops por referencias nuevas.
  useEffect(() => {
    setMonth((prev) => {
      const next = selectedDate ?? new Date();
      return prev.getTime() === next.getTime() ? prev : next;
    });
  }, [selectedDate]);

  return (
    <Popover className="relative">
      <Popover.Button
        id={id}
        disabled={disabled}
        className="w-full inline-flex items-center justify-start gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800 text-left text-gray-700 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-60"
      >
        <svg
          className="fill-current text-gray-400 dark:text-gray-500"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
          <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"></path>
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {selectedDate ? format(selectedDate, "PPP") : placeholder}
        </span>
      </Popover.Button>

      <Popover.Panel className="absolute z-20 mt-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/60 p-3">
          <DayPicker
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selectedDate}
            onSelect={(d) => onChange(d ? d.toISOString() : "")}
            captionLayout="dropdown-buttons"
            fromYear={fromYear}
            toYear={toYear}
          />
        </div>
      </Popover.Panel>
    </Popover>
  );
}
