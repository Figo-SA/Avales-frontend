"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/providers/auth-provider";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, error } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Cargando tu sesión...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-600">
          No pudimos cargar tu sesión. Intenta nuevamente.
        </p>
      </div>
    );
  }

  if (!user) return null; // redirección en curso

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">
        Bienvenido, {user.nombre ?? "Usuario"} - Dashboard
      </p>
    </div>
  );
}
