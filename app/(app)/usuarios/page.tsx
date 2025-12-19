// app/(admin)/usuarios/page.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { listUsers } from "@/lib/api/user";
import { User } from "@/types/user";
import UsuarioTable from "./_components/usuario-table";
import AlertBanner from "@/components/ui/alert-banner";

export default function Usuarios() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{
    variant: "success" | "error";
    message: string;
    description?: string;
  } | null>(null);

  const pageSize = 8;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listUsers();
      console.log(res.data);
      setUsers(res.data ?? []);
    } catch (err: any) {
      const msg = err?.message ?? "No se pudo cargar la lista de usuarios.";
      setError(msg);
      setToast({
        variant: "error",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  // leer mensaje de exito desde querystring y limpiar la URL
  useEffect(() => {
    const status = searchParams.get("status");
    if (!status) return;

    if (status === "created") {
      setToast({
        variant: "success",
        message: "Usuario creado correctamente.",
        description: "El listado se actualiza automaticamente.",
      });
    } else if (status === "updated") {
      setToast({
        variant: "success",
        message: "Usuario actualizado correctamente.",
        description: "El listado se actualiza automaticamente.",
      });
    } else if (status === "error") {
      setToast({
        variant: "error",
        message: "Ocurrio un problema al procesar tu solicitud.",
      });
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    router.replace(params.toString() ? `/usuarios?${params}` : "/usuarios", {
      scroll: false,
    });
  }, [searchParams, router]);
  useEffect(() => {
    if (!toast) return;

    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return users.filter((u) => {
      const fullName = `${u.nombre} ${u.apellido}`.toLowerCase();
      return (
        !qq ||
        fullName.includes(qq) ||
        u.email.toLowerCase().includes(qq) ||
        u.cedula.includes(qq) ||
        String(u.id).includes(qq)
      );
    });
  }, [q, users]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <>
      {/* Toast flotante arriba a la derecha (estilo Mosaic) */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full drop-shadow-lg">
          <AlertBanner
            variant={toast.variant}
            message={toast.message}
            description={toast.description}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto space-y-6">
        <div className="sm:flex sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text2-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Usuarios
            </h1>
          </div>

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <input
              className="form-input w-full sm:w-64"
              placeholder="Buscar por nombre, email, cedula..."
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />

            <Link
              href="/usuarios/nuevo"
              className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              Crear usuario
            </Link>
          </div>
        </div>

        <UsuarioTable users={paged} loading={loading} error={error} />

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Pagina {safePage} de {totalPages} (mostrando {paged.length} de{" "}
          {filtered.length})
        </div>
      </div>
    </>
  );
}
