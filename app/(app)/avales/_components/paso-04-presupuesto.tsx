"use client";

import { useState } from "react";
import { Plus, X, DollarSign, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatters";
import { useRouter } from "next/navigation";
import { createAval } from "@/lib/api/avales";

type FormData = {
  deportistas: Array<{ id: number; nombre: string }>;
  entrenadores: Array<{ id: number; nombre: string }>;
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  objetivos: string[];
  criterios: string[];
  rubros: Array<{
    rubroId: number;
    cantidadDias: string;
    valorUnitario?: number;
  }>;
  observaciones?: string;
};

type Step04PresupuestoProps = {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
  onBack: () => void;
  avalId: number;
};

type RubroForm = {
  rubroId: string;
  cantidadDias: string;
  valorUnitario: string;
};

const INITIAL_RUBRO_FORM: RubroForm = {
  rubroId: "",
  cantidadDias: "",
  valorUnitario: "",
};

export default function Step04Presupuesto({
  formData,
  onBack,
  avalId,
}: Step04PresupuestoProps) {
  const router = useRouter();
  const [rubros, setRubros] = useState(formData.rubros || []);
  const [observaciones, setObservaciones] = useState(
    formData.observaciones || ""
  );
  const [rubroForm, setRubroForm] = useState<RubroForm>(INITIAL_RUBRO_FORM);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAddRubro = () => {
    const parsedRubroId = parseInt(rubroForm.rubroId);
    const trimmedCantidadDias = rubroForm.cantidadDias.trim();
    const parsedValorUnitario = rubroForm.valorUnitario
      ? parseFloat(rubroForm.valorUnitario)
      : undefined;

    if (!rubroForm.rubroId || isNaN(parsedRubroId)) {
      setError("Debes seleccionar un rubro");
      return;
    }

    if (!trimmedCantidadDias) {
      setError("La cantidad de días es requerida");
      return;
    }

    if (
      rubroForm.valorUnitario &&
      (isNaN(parsedValorUnitario!) || parsedValorUnitario! <= 0)
    ) {
      setError("El valor unitario debe ser un número mayor a 0");
      return;
    }

    setRubros([
      ...rubros,
      {
        rubroId: parsedRubroId,
        cantidadDias: trimmedCantidadDias,
        valorUnitario: parsedValorUnitario,
      },
    ]);

    setRubroForm(INITIAL_RUBRO_FORM);
    setShowForm(false);
    setError(null);
  };

  const handleRemoveRubro = (index: number) => {
    setRubros(rubros.filter((_, i) => i !== index));
  };

  const getTotalPresupuesto = () => {
    return rubros.reduce((sum, rubro) => {
      const dias = parseFloat(rubro.cantidadDias) || 0;
      const valorUnitario = rubro.valorUnitario || 0;
      return sum + dias * valorUnitario;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rubros.length === 0) {
      setError("Debes agregar al menos un rubro presupuestario");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Preparar el payload según la estructura esperada por la API
      const payload = {
        coleccionAvalId: avalId,
        fechaHoraSalida: formData.fechaHoraSalida,
        fechaHoraRetorno: formData.fechaHoraRetorno,
        transporteSalida: formData.transporteSalida,
        transporteRetorno: formData.transporteRetorno,
        objetivos: formData.objetivos.map((obj, index) => ({
          orden: index + 1,
          descripcion: obj,
        })),
        criterios: formData.criterios.map((crit, index) => ({
          orden: index + 1,
          descripcion: crit,
        })),
        rubros: rubros,
        deportistas: formData.deportistas.map((d) => ({
          deportistaId: d.id,
          rol: "DEPORTISTA",
        })),
        entrenadores: formData.entrenadores.map((e) => ({
          entrenadorId: e.id,
          rol: "ENTRENADOR",
          esPrincipal: false,
        })),
        observaciones: observaciones.trim() || undefined,
      };

      await createAval(payload);

      // Redirigir a la lista de avales con mensaje de éxito
      router.push("/avales?status=created");
    } catch (err: any) {
      console.error("Error al crear el aval:", err);
      setError(err?.message ?? "No se pudo crear el aval técnico");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-2">
        Presupuesto
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Define los rubros presupuestarios necesarios para el evento.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rubros Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rubros presupuestarios
          </label>

          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition"
            >
              <Plus className="w-5 h-5" />
              Agregar rubro
            </button>
          ) : (
            <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ID del rubro
                </label>
                <input
                  type="number"
                  value={rubroForm.rubroId}
                  onChange={(e) =>
                    setRubroForm({ ...rubroForm, rubroId: e.target.value })
                  }
                  placeholder="ID del rubro"
                  className="form-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cantidad de días
                </label>
                <input
                  type="text"
                  value={rubroForm.cantidadDias}
                  onChange={(e) =>
                    setRubroForm({ ...rubroForm, cantidadDias: e.target.value })
                  }
                  placeholder="Ej: 5"
                  className="form-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor unitario (USD) (opcional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={rubroForm.valorUnitario}
                    onChange={(e) =>
                      setRubroForm({ ...rubroForm, valorUnitario: e.target.value })
                    }
                    placeholder="0.00"
                    className="form-input w-full pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddRubro}
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white flex-1"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setRubroForm(INITIAL_RUBRO_FORM);
                    setError(null);
                  }}
                  className="btn border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Rubros List */}
          {rubros.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {rubros.length}{" "}
                  {rubros.length === 1 ? "rubro agregado" : "rubros agregados"}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Total: {formatCurrency(getTotalPresupuesto())}
                </p>
              </div>

              <div className="space-y-2">
                {rubros.map((rubro, index) => {
                  const dias = parseFloat(rubro.cantidadDias) || 0;
                  const valorUnitario = rubro.valorUnitario || 0;
                  const total = dias * valorUnitario;

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              Rubro ID: {rubro.rubroId}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {rubro.cantidadDias} días
                              {valorUnitario > 0 && ` × ${formatCurrency(valorUnitario)}`}
                            </p>
                          </div>
                          <p className="font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                            {formatCurrency(total)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveRubro(index)}
                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {rubros.length === 0 && !showForm && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
              No hay rubros agregados. Agrega al menos uno para continuar.
            </p>
          )}
        </div>

        {/* Observaciones generales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Observaciones generales (opcional)
            </div>
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Información adicional relevante para el aval..."
            rows={4}
            className="form-textarea w-full"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
          >
            {submitting ? "Creando aval..." : "Crear aval técnico"}
          </button>
        </div>
      </form>
    </div>
  );
}
