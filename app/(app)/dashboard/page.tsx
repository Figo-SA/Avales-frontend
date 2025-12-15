"use client";

import { useAuth } from "@/app/auth-provider"; // ajusta la ruta real

export default function Dashboard() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Cargando usuario...</p>
      </div>
    );
  }

  // Esto es solo por UX (la seguridad debe estar en proxy/middleware)
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">
        Bienvenido, {user?.nombre ?? "Usuario"} — Dashboard
      </p>
    </div>
  );
}
