"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
      } catch (error) {
        console.error("Error verificando sesión:", error);
        router.replace("/signin");
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">
        Bienvenido, {user?.name ?? "Usuario"} — Dashboard
      </p>
    </div>
  );
}
