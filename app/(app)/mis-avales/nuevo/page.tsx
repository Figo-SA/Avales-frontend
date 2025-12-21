"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getCatalog } from "@/lib/api/catalog";
import { createEvento } from "@/lib/api/evento";
import type { CatalogItem } from "@/types/catalog";
import type { CreateEventoInput, Genero } from "@/types/evento";

type FormValues = {
  codigo: string;
  nombre: string;
  tipoParticipacion: string;
  tipoEvento: string;
  genero: Genero;
  disciplinaId: number;
  categoriaId: number;
  lugar: string;
  provincia: string;
  ciudad: string;
  pais: string;
  alcance: string;
  fechaInicio: string;
  fechaFin: string;
  numAtletasHombres: number;
  numAtletasMujeres: number;
  numEntrenadoresHombres: number;
  numEntrenadoresMujeres: number;
};

export default function NuevoEventoPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<CatalogItem[]>([]);
  const [disciplinas, setDisciplinas] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      codigo: "",
      nombre: "",
      tipoParticipacion: "",
      tipoEvento: "",
      genero: "MASCULINO",
      disciplinaId: 0,
      categoriaId: 0,
      lugar: "",
      provincia: "",
      ciudad: "",
      pais: "Ecuador",
      alcance: "",
      fechaInicio: "",
      fechaFin: "",
      numAtletasHombres: 0,
      numAtletasMujeres: 0,
      numEntrenadoresHombres: 0,
      numEntrenadoresMujeres: 0,
    },
  });

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

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    const data: CreateEventoInput = {
      ...values,
      disciplinaId: Number(values.disciplinaId),
      categoriaId: Number(values.categoriaId),
      numAtletasHombres: Number(values.numAtletasHombres),
      numAtletasMujeres: Number(values.numAtletasMujeres),
      numEntrenadoresHombres: Number(values.numEntrenadoresHombres),
      numEntrenadoresMujeres: Number(values.numEntrenadoresMujeres),
    };

    try {
      await createEvento(data);
      router.push("/mis-avales?status=success");
    } catch (err: any) {
      setSubmitError(err?.message ?? "Error al crear el evento");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Nuevo Evento
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Crea un nuevo evento deportivo para luego solicitar el aval correspondiente.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {submitError}
          </div>
        )}

        {/* Información básica */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Información Básica
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium mb-1">
                Código *
              </label>
              <input
                id="codigo"
                type="text"
                className="form-input w-full"
                {...register("codigo", { required: "El código es obligatorio" })}
              />
              {errors.codigo && (
                <p className="mt-1 text-xs text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-1">
                Nombre del Evento *
              </label>
              <input
                id="nombre"
                type="text"
                className="form-input w-full"
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tipoEvento" className="block text-sm font-medium mb-1">
                Tipo de Evento *
              </label>
              <input
                id="tipoEvento"
                type="text"
                className="form-input w-full"
                placeholder="Ej: Campeonato, Torneo, etc."
                {...register("tipoEvento", { required: "El tipo es obligatorio" })}
              />
              {errors.tipoEvento && (
                <p className="mt-1 text-xs text-red-600">{errors.tipoEvento.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tipoParticipacion" className="block text-sm font-medium mb-1">
                Tipo de Participación *
              </label>
              <input
                id="tipoParticipacion"
                type="text"
                className="form-input w-full"
                placeholder="Ej: Individual, Equipos, etc."
                {...register("tipoParticipacion", { required: "El tipo de participación es obligatorio" })}
              />
              {errors.tipoParticipacion && (
                <p className="mt-1 text-xs text-red-600">{errors.tipoParticipacion.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="genero" className="block text-sm font-medium mb-1">
                Género *
              </label>
              <select
                id="genero"
                className="form-select w-full"
                {...register("genero", { required: "El género es obligatorio" })}
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="MASCULINO_FEMENINO">Mixto</option>
              </select>
            </div>

            <div>
              <label htmlFor="alcance" className="block text-sm font-medium mb-1">
                Alcance *
              </label>
              <input
                id="alcance"
                type="text"
                className="form-input w-full"
                placeholder="Ej: Nacional, Provincial, etc."
                {...register("alcance", { required: "El alcance es obligatorio" })}
              />
              {errors.alcance && (
                <p className="mt-1 text-xs text-red-600">{errors.alcance.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Disciplina y Categoría */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Disciplina y Categoría
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="disciplinaId" className="block text-sm font-medium mb-1">
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
                <p className="mt-1 text-xs text-red-600">{errors.disciplinaId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoriaId" className="block text-sm font-medium mb-1">
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
                <p className="mt-1 text-xs text-red-600">{errors.categoriaId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Ubicación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="lugar" className="block text-sm font-medium mb-1">
                Lugar *
              </label>
              <input
                id="lugar"
                type="text"
                className="form-input w-full"
                placeholder="Ej: Coliseo Municipal, Estadio..."
                {...register("lugar", { required: "El lugar es obligatorio" })}
              />
              {errors.lugar && (
                <p className="mt-1 text-xs text-red-600">{errors.lugar.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium mb-1">
                Ciudad *
              </label>
              <input
                id="ciudad"
                type="text"
                className="form-input w-full"
                {...register("ciudad", { required: "La ciudad es obligatoria" })}
              />
              {errors.ciudad && (
                <p className="mt-1 text-xs text-red-600">{errors.ciudad.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="provincia" className="block text-sm font-medium mb-1">
                Provincia *
              </label>
              <input
                id="provincia"
                type="text"
                className="form-input w-full"
                {...register("provincia", { required: "La provincia es obligatoria" })}
              />
              {errors.provincia && (
                <p className="mt-1 text-xs text-red-600">{errors.provincia.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="pais" className="block text-sm font-medium mb-1">
                País *
              </label>
              <input
                id="pais"
                type="text"
                className="form-input w-full"
                {...register("pais", { required: "El país es obligatorio" })}
              />
              {errors.pais && (
                <p className="mt-1 text-xs text-red-600">{errors.pais.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Fechas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaInicio" className="block text-sm font-medium mb-1">
                Fecha de Inicio *
              </label>
              <input
                id="fechaInicio"
                type="datetime-local"
                className="form-input w-full"
                {...register("fechaInicio", { required: "La fecha de inicio es obligatoria" })}
              />
              {errors.fechaInicio && (
                <p className="mt-1 text-xs text-red-600">{errors.fechaInicio.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="fechaFin" className="block text-sm font-medium mb-1">
                Fecha de Fin *
              </label>
              <input
                id="fechaFin"
                type="datetime-local"
                className="form-input w-full"
                {...register("fechaFin", { required: "La fecha de fin es obligatoria" })}
              />
              {errors.fechaFin && (
                <p className="mt-1 text-xs text-red-600">{errors.fechaFin.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Participantes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Número de Participantes
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="numAtletasHombres" className="block text-sm font-medium mb-1">
                Atletas Hombres
              </label>
              <input
                id="numAtletasHombres"
                type="number"
                min="0"
                className="form-input w-full"
                {...register("numAtletasHombres", { min: 0 })}
              />
            </div>

            <div>
              <label htmlFor="numAtletasMujeres" className="block text-sm font-medium mb-1">
                Atletas Mujeres
              </label>
              <input
                id="numAtletasMujeres"
                type="number"
                min="0"
                className="form-input w-full"
                {...register("numAtletasMujeres", { min: 0 })}
              />
            </div>

            <div>
              <label htmlFor="numEntrenadoresHombres" className="block text-sm font-medium mb-1">
                Entrenadores Hombres
              </label>
              <input
                id="numEntrenadoresHombres"
                type="number"
                min="0"
                className="form-input w-full"
                {...register("numEntrenadoresHombres", { min: 0 })}
              />
            </div>

            <div>
              <label htmlFor="numEntrenadoresMujeres" className="block text-sm font-medium mb-1">
                Entrenadoras Mujeres
              </label>
              <input
                id="numEntrenadoresMujeres"
                type="number"
                min="0"
                className="form-input w-full"
                {...register("numEntrenadoresMujeres", { min: 0 })}
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn bg-violet-500 text-white hover:bg-violet-600"
          >
            {isSubmitting ? "Creando..." : "Crear Evento"}
          </button>
        </div>
      </form>
    </div>
  );
}
