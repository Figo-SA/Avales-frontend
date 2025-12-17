"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("Falta NEXT_PUBLIC_API_URL");
          router.replace("/signin");
          return;
        }

        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: "GET",
          credentials: "include", // IMPORTANTE para enviar la cookie HttpOnly
        });

        if (!res.ok) {
          // No hay sesión → login
          router.replace("/signin");
          return;
        }

        const data = await res.json();
        setUser(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error verificando sesión:", err);
        setError("Error al verificar la sesión");
        router.replace("/signin");
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Cargando...</p>
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
