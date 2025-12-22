"use client";

import { useRouter } from "next/navigation";

import CreateDeportistaForm from "../_components/create-deportista-form";

export default function NuevoDeportista() {
  const router = useRouter();

  const handleCreated = async () => {
    router.push("/deportistas?status=created");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Crear deportista
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completa los datos personales y la seccion de afiliacion. Al guardar
          regresaras al listado.
        </p>
      </div>

      <CreateDeportistaForm onCreated={handleCreated} />
    </div>
  );
}
