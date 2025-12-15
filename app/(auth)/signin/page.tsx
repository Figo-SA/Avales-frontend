"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthImage from "../_components/aut-image";
import LogoFedeLoja from "@/public/images/LogoFedeLoja.png";
import { useAuth } from "@/app/providers/auth-provider";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        setError("Error de configuración. Falta NEXT_PUBLIC_API_URL.");
        return;
      }

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // IMPORTANTE: para que guarde/mande cookies
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && (data.message || data.error)) ||
          "Usuario o contraseña incorrectos.";
        setError(message);
        return;
      }

      // OJO: ya NO guardamos token en localStorage ni en cookie manualmente.
      // El token está en la cookie HttpOnly que setea el backend.

      await refreshUser();

      // 2) Redirigimos al dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error de conexión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-slate-900 flex h-screen">
      <div className="hidden md:flex w-1/2 relative">
        <AuthImage className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 relative">
        <div className="absolute top-4 right-4">
          <Image
            src={LogoFedeLoja}
            alt="Logo Federación Deportiva"
            width={80}
            height={80}
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
          />
        </div>

        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">
            Federación Deportiva Provincial de Loja
          </h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Usuario
              </label>
              <input
                id="email"
                className="form-input w-full border-gray-300 rounded-md p-2"
                type="text"
                aria-label="Usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                id="password"
                className="form-input w-full border-gray-300 rounded-md p-2"
                type="password"
                autoComplete="current-password"
                aria-label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-600 text-white text-sm p-3 rounded-md border-l-4 border-red-800 shadow-md flex items-center">
                <svg
                  className="w-5 h-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M5.22 5.22a9 9 0 0113.56 0m1.42 1.42a9 9 0 01-1.42 12.72m-1.42-1.42a9 9 0 01-12.72 1.42m-1.42-1.42a9 9 0 011.42-12.72"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`w-full flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md transition duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
