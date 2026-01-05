"use client";

import { useRouter } from "next/navigation";

import UsuarioForm from "../_components/usuario-form";

export default function NuevoUsuario() {
  const router = useRouter();

  const handleCreated = async () => {
    router.push("/usuarios?status=created");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Crear usuario
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completa la informacion y asigna al menos un rol. Despues de crear, se
          regresa al listado.
        </p>
      </div>

      <UsuarioForm onCreated={handleCreated} />
    </div>
  );
}
