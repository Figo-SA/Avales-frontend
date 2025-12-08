// app/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { AuthContextType, User } from "./types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        setError("Falta NEXT_PUBLIC_API_URL");
        setUser(null);
        return;
      }

      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "GET",
        credentials: "include",
      });

      // 401/403 => estado normal de "no autenticado"
      if (res.status === 401 || res.status === 403) {
        setUser(null);
        // OJO: no lo tratamos como error, es estado invitado
        return;
      }

      if (!res.ok) {
        // Otros errores de servidor sí se consideran error real
        setUser(null);
        setError(`Error al cargar usuario (${res.status})`);
        return;
      }

      const data = await res.json();
      const user = data.data as User;
      setUser(user);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setUser(null);
      setError("No se pudo cargar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
