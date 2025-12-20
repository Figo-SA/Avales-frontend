"use client";

import AvalForm from "@/components/avales/aval-form";

export default function NuevoAvalPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Nuevo Aval
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Crea una nueva solicitud de aval deportivo seleccionando la disciplina,
          categoría y los deportistas que participarán.
        </p>
      </div>

      <AvalForm mode="create" />
    </div>
  );
}
