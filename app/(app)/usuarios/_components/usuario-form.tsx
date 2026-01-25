"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ApiError } from "@/lib/api/client";
import { createUser, updateUser } from "@/lib/api/user";
import { getCatalog } from "@/lib/api/catalog";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
  type UserFormValues,
} from "@/lib/validation/user";
import { CatalogItem } from "@/types/catalog";
import type { Role } from "@/types/user";

const ROLE_OPTIONS: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "SECRETARIA",
  "DTM",
  "METODOLOGO",
  "ENTRENADOR",
  "USUARIO",
  "DEPORTISTA",
  "PDA",
  "COMPRAS_PUBLICAS",
  "FINANCIERO",
];

const defaultRoleSelection: Role[] = [];

const formatRoleLabel = (role: Role) =>
  role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

type Props = {
  mode?: "create" | "edit";
  userId?: number;
  initialValues?: UpdateUserFormValues;
  onCreated?: () => Promise<void>;
  onUpdated?: () => Promise<void>;
};

export default function UsuarioForm({
  mode = "create",
  userId,
  initialValues,
  onCreated,
  onUpdated,
}: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<CatalogItem[]>([]);
  const [disciplinas, setDisciplinas] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const schema = useMemo(
    () => (mode === "edit" ? updateUserSchema : createUserSchema),
    [mode]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: initialValues?.nombre ?? "",
      apellido: initialValues?.apellido ?? "",
      email: initialValues?.email ?? "",
      password: "",
      cedula: initialValues?.cedula ?? "",
      genero: initialValues?.genero ?? "",
      categoriaId: initialValues?.categoriaId,
      disciplinaId: initialValues?.disciplinaId,
      roles: initialValues?.roles ?? defaultRoleSelection,
    },
  });

  // sincronizar valores iniciales cuando llegan (edicion)
  useEffect(() => {
    if (!initialValues) return;
    if (catalogLoading) return;
    reset({
      ...initialValues,
      password: "",
      roles:
        initialValues.roles && initialValues.roles.length > 0
          ? initialValues.roles
          : defaultRoleSelection,
    });
  }, [initialValues, catalogLoading, reset]);

  // cargar catalogos de categorias y disciplinas
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setCatalogLoading(true);
        setCatalogError(null);
        const res = await getCatalog();
        const cats = res.data?.categorias ?? [];
        const discs = res.data?.disciplinas ?? [];
        setCategorias(cats);
        setDisciplinas(discs);
      } catch (err: any) {
        setCatalogError(
          err?.message ?? "No se pudieron cargar categorias/disciplinas."
        );
        setCategorias([]);
        setDisciplinas([]);
      } finally {
        setCatalogLoading(false);
      }
    };

    void loadCatalog();
  }, []);

  const onSubmit = async (values: UserFormValues) => {
    setSubmitError(null);

    try {
      if (mode === "edit") {
        if (!userId) {
          throw new Error("No se pudo identificar el usuario a editar.");
        }
        const cleaned: UpdateUserFormValues = {
          ...values,
          password: values.password?.trim()
            ? values.password.trim()
            : undefined,
        };

        await updateUser(userId, cleaned);
        if (onUpdated) {
          await onUpdated();
        }
      } else {
        const cleanedForCreate: CreateUserFormValues = {
          ...values,
          password: values.password?.trim() ?? "",
        } as CreateUserFormValues;

        await createUser(cleanedForCreate);
        reset({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
          cedula: "",
          genero: "",
          categoriaId: undefined,
          disciplinaId: undefined,
          roles: defaultRoleSelection,
        });
        if (onCreated) {
          await onCreated();
        }
      }
    } catch (err: unknown) {
      const fallback = `No se pudo ${
        mode === "edit" ? "actualizar" : "crear"
      } el usuario.`;
      let message = fallback;

      if (err instanceof ApiError) {
        const problem = err.problem;
        const detail =
          problem?.detail ?? problem?.title ?? err.message ?? fallback;
        if (problem?.field) {
          const fieldName = problem.field as keyof UserFormValues;
          setError(fieldName, { type: "server", message: detail });
        }
        message = detail;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setSubmitError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {mode === "edit" ? "Editar usuario" : "Crear usuario"}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            className="form-input w-full"
            type="text"
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="apellido">
            Apellido
          </label>
          <input
            id="apellido"
            className="form-input w-full"
            type="text"
            {...register("apellido")}
          />
          {errors.apellido && (
            <p className="mt-1 text-xs text-red-600">
              {errors.apellido.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="form-input w-full"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password {mode === "edit" && "(opcional)"}
          </label>
          <input
            id="password"
            className="form-input w-full"
            type="password"
            placeholder={
              mode === "edit" ? "Deja en blanco para no cambiarla" : undefined
            }
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="cedula">
            Cedula
          </label>
          <input
            id="cedula"
            className="form-input w-full"
            type="text"
            inputMode="numeric"
            {...register("cedula")}
          />
          {errors.cedula && (
            <p className="mt-1 text-xs text-red-600">{errors.cedula.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="genero">
            Género
          </label>
          <select
            id="genero"
            className="form-select w-full"
            {...register("genero")}
          >
            <option value="">Selecciona una opción</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="MASCULINO_FEMENINO">Masculino/Femenino</option>
          </select>
          {errors.genero && (
            <p className="mt-1 text-xs text-red-600">{errors.genero.message}</p>
          )}
        </div>

        <Controller
          control={control}
          name="roles"
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="roles">
                Roles
              </label>
              <select
                id="roles"
                className="form-select w-full"
                value={field.value[0] ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? ([e.target.value] as Role[]) : []
                  )
                }
              >
                <option value="">Selecciona una opcion</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {formatRoleLabel(role)}
                  </option>
                ))}
              </select>
              <div className="mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Selecciona una opcion para asignar rol. No puede quedar sin
                  rol.
                </p>
              </div>
              {errors.roles && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.roles.message}
                </p>
              )}
            </div>
          )}
        />

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="categoriaId"
          >
            Categoria
          </label>
          <select
            id="categoriaId"
            className="form-select w-full"
            disabled={catalogLoading || !categorias.length}
            {...register("categoriaId", {
              setValueAs: (v) => Number(v),
            })}
          >
            <option value="">Selecciona una opcion</option>
            {(categorias ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {errors.categoriaId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.categoriaId.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="disciplinaId"
          >
            Disciplina
          </label>
          <select
            id="disciplinaId"
            className="form-select w-full"
            disabled={catalogLoading || !disciplinas.length}
            {...register("disciplinaId", {
              setValueAs: (v) => Number(v),
            })}
          >
            <option value="">Selecciona una opcion</option>
            {(disciplinas ?? []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
          {errors.disciplinaId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.disciplinaId.message}
            </p>
          )}
        </div>
      </div>

      {catalogError && <p className="text-sm text-red-600">{catalogError}</p>}

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700/60">
        <button
          type="submit"
          disabled={isSubmitting || catalogLoading}
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          {isSubmitting
            ? "Guardando..."
            : mode === "edit"
            ? "Guardar cambios"
            : "Guardar usuario"}
        </button>
      </div>
    </form>
  );
}
