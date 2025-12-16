"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Option {
  value: number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: Option[];
  register: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  placeholder?: string;
}

export default function SelectField({
  label,
  options,
  register,
  error,
  disabled,
  placeholder = "Seleccione…",
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <select className="form-select w-full" disabled={disabled} {...register}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
