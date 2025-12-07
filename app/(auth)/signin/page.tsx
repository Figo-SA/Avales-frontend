"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthImage from "../_components/aut-image";
import LogoFedeLoja from "@/public/images/LogoFedeLoja.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  console.log(process.env.NEXT_PUBLIC_API_URL);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Guardar el token en localStorage
        router.push("/dashboard"); // Redirigir al Dashboard
      } else {
        setError(data.message || "Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      setError("Error de conexión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-slate-900 flex h-screen">
      {/* Sección de la imagen (lado izquierdo) */}
      <div className="hidden md:flex w-1/2 relative">
        <AuthImage className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Sección del formulario (lado derecho) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 relative">
        {/* Logo en la parte superior derecha */}
        <div className="absolute top-4 right-4">
          <Image
            src={LogoFedeLoja}
            alt="Logo Federación Deportiva"
            width={80} // No modificar en CSS
            height={80} // No modificar en CSS
            style={{ width: "auto", height: "auto" }} // Ajusta el tamaño sin distorsionar
            className="object-contain"
          />
        </div>

        {/* Contenedor del formulario */}
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

            {/* Mensaje de error formal */}
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

            {/* Botón de inicio de sesión */}
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
