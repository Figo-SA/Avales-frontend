"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { getCatalog } from "@/lib/api/catalog";
import { createAval, updateAval, enviarAval } from "@/lib/api/aval";
import type { CatalogItem } from "@/types/catalog";
import type { CreateAvalInput } from "@/types/aval";
import DeportistasSelector from "./deportistas-selector";

type FormValues = {
  disciplinaId: number;
  categoriaId: number;
  observaciones: string;
};

type Props = {
  mode: "create" | "edit";
  avalId?: number;
  initialValues?: Partial<CreateAvalInput>;
  initialDeportistaIds?: number[];
  onSuccess?: () => void;
};

export default function AvalForm({
  mode,
  avalId,
  initialValues,
  initialDeportistaIds = [],
  onSuccess,
}: Props) {
  const router = useRouter();
  const [categorias, setCategorias] = useState<CatalogItem[]>([]);
  const [disciplinas, setDisciplinas] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [deportistaIds, setDeportistaIds] = useState<number[]>(initialDeportistaIds);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      disciplinaId: initialValues?.disciplinaId ?? 0,
      categoriaId: initialValues?.categoriaId ?? 0,
      observaciones: initialValues?.observaciones ?? "",
    },
  });

  // Cargar catálogo
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCatalog();
        setCategorias(res.data?.categorias ?? []);
        setDisciplinas(res.data?.disciplinas ?? []);
      } catch (err) {
        console.error("Error cargando catálogo", err);
      } finally {
        setCatalogLoading(false);
      }
    };
    void load();
  }, []);

  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues) {
      reset({
        disciplinaId: initialValues.disciplinaId ?? 0,
        categoriaId: initialValues.categoriaId ?? 0,
        observaciones: initialValues.observaciones ?? "",
      });
    }
    if (initialDeportistaIds.length > 0) {
      setDeportistaIds(initialDeportistaIds);
    }
  }, [initialValues, initialDeportistaIds, reset]);

  const onSubmit = async (values: FormValues, sendAfterSave = false) => {
    setSubmitError(null);

    if (deportistaIds.length === 0) {
      setSubmitError("Debes seleccionar al menos un deportista");
      return;
    }

    const data: CreateAvalInput = {
      disciplinaId: Number(values.disciplinaId),
      categoriaId: Number(values.categoriaId),
      deportistaIds,
      observaciones: values.observaciones || undefined,
    };

    try {
      let savedAval;
      if (mode === "create") {
        const res = await createAval(data);
        savedAval = res.data;
      } else if (avalId) {
        const res = await updateAval(avalId, data);
        savedAval = res.data;
      }

      // Si se debe enviar después de guardar
      if (sendAfterSave && savedAval?.id) {
        setIsSending(true);
        await enviarAval(savedAval.id);
      }

      onSuccess?.();
      router.push("/mis-avales?status=success");
    } catch (err: any) {
      setSubmitError(err?.message ?? "Error al guardar el aval");
    } finally {
      setIsSending(false);
    }
  };

  const handleSave = handleSubmit((values) => onSubmit(values, false));
  const handleSaveAndSend = handleSubmit((values) => onSubmit(values, true));

  return (
    <form className="space-y-6">
      {submitError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {submitError}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Información del Aval
        </h3>

        {/* Disciplina y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="disciplinaId"
              className="block text-sm font-medium mb-1"
            >
              Disciplina *
            </label>
            <select
              id="disciplinaId"
              className="form-select w-full"
              disabled={catalogLoading}
              {...register("disciplinaId", {
                required: "Selecciona una disciplina",
                validate: (v) => Number(v) > 0 || "Selecciona una disciplina",
              })}
            >
              <option value="0">Selecciona una disciplina</option>
              {disciplinas.map((d) => (
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

          <div>
            <label
              htmlFor="categoriaId"
              className="block text-sm font-medium mb-1"
            >
              Categoría *
            </label>
            <select
              id="categoriaId"
              className="form-select w-full"
              disabled={catalogLoading}
              {...register("categoriaId", {
                required: "Selecciona una categoría",
                validate: (v) => Number(v) > 0 || "Selecciona una categoría",
              })}
            >
              <option value="0">Selecciona una categoría</option>
              {categorias.map((c) => (
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
        </div>

        {/* Observaciones */}
        <div>
          <label
            htmlFor="observaciones"
            className="block text-sm font-medium mb-1"
          >
            Observaciones (opcional)
          </label>
          <textarea
            id="observaciones"
            rows={3}
            className="form-textarea w-full"
            placeholder="Notas adicionales sobre el aval..."
            {...register("observaciones")}
          />
        </div>
      </div>

      {/* Selección de deportistas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Deportistas *
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona los deportistas que formarán parte de este aval.
        </p>
        <DeportistasSelector
          selectedIds={deportistaIds}
          onChange={setDeportistaIds}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting || isSending}
          className="btn bg-gray-600 text-white hover:bg-gray-700"
        >
          {isSubmitting ? "Guardando..." : "Guardar como Borrador"}
        </button>
        <button
          type="button"
          onClick={handleSaveAndSend}
          disabled={isSubmitting || isSending}
          className="btn bg-violet-500 text-white hover:bg-violet-600"
        >
          {isSending ? "Enviando..." : "Guardar y Enviar"}
        </button>
      </div>
    </form>
  );
}
