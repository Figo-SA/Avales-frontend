"use client";

import { useRouter } from "next/navigation";
import EventoForm from "../_components/evento-form";

export default function NuevoEventoPage() {
  const router = useRouter();

  const handleCreated = async () => {
    router.push("/eventos?status=created");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Nuevo evento
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completa el formulario para registrar un nuevo evento deportivo.
        </p>
      </div>

      <EventoForm onCreated={handleCreated} />
    </div>
  );
}
