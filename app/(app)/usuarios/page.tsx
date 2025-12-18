// app/(admin)/usuarios/page.tsx
"use client";

import { Role, User } from "@/types/user";
import { useMemo, useState } from "react";
import UsuarioTable from "./_components/usuario-table";

const users: User[] = [
  {
    id: 1,
    email: "superadmin@demo.com",
    nombre: "Ana",
    apellido: "Vera",
    cedula: "1101234567",
    categoriaId: 1,
    disciplinaId: 3,
    roles: ["SUPER_ADMIN", "ADMIN"],
    createdAt: "2025-12-01",
  },
  {
    id: 2,
    email: "admin@demo.com",
    nombre: "Carlos",
    apellido: "Mora",
    cedula: "1107654321",
    categoriaId: 2,
    disciplinaId: 1,
    roles: ["ADMIN"],
    createdAt: "2025-11-18",
  },
  {
    id: 3,
    email: "secretaria@demo.com",
    nombre: "Lucía",
    apellido: "Ortega",
    cedula: "1100001112",
    categoriaId: 4,
    disciplinaId: 2,
    roles: ["SECRETARIA"],
    createdAt: "2025-10-05",
  },
];

function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, string> = {
    SUPER_ADMIN: "bg-rose-500/15 text-rose-400 ring-rose-500/20",
    ADMIN: "bg-sky-500/15 text-sky-400 ring-sky-500/20",
    SECRETARIA: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
    DTM: "bg-violet-500/15 text-violet-400 ring-violet-500/20",
    DTM_EIDE: "bg-violet-500/15 text-violet-300 ring-violet-500/20",
    PDA: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
    FINANCIERO: "bg-indigo-500/15 text-indigo-400 ring-indigo-500/20",
    ENTRENADOR: "bg-slate-500/15 text-slate-300 ring-slate-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${map[role]}`}
    >
      {role}
    </span>
  );
}

export default function Usuarios() {
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"TODOS" | Role>("TODOS");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return users.filter((u) => {
      const fullName = `${u.nombre} ${u.apellido}`.toLowerCase();
      const okQ =
        !qq ||
        fullName.includes(qq) ||
        u.email.toLowerCase().includes(qq) ||
        u.cedula.includes(qq) ||
        String(u.id).includes(qq);

      const okRole =
        roleFilter === "TODOS" ? true : (u.roles ?? []).includes(roleFilter);

      return okQ && okRole;
    });
  }, [q, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-5">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Usuarios
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Search form */}
          {/* <SearchForm placeholder="Search by invoice ID…" /> */}
          {/* Create invoice button */}
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
            <svg
              className="fill-current shrink-0 xs:hidden"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="max-xs:sr-only">Crear Usuario</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <UsuarioTable users={users} />

      {/* Pagination */}
      <div className="mt-8">{/* <PaginationClassic /> */}</div>
    </div>
  );
}
