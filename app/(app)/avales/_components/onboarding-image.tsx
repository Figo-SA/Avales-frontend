import type { Aval } from "@/types/aval";
import { Calendar, MapPin, Users, Clock, DollarSign, Target } from "lucide-react";
import {
  formatDateRange,
  formatLocationWithProvince,
  formatDateTime,
  formatCurrency,
} from "@/lib/utils/formatters";

type FormData = {
  deportistas: Array<{ id: number; nombre: string }>;
  entrenadores: Array<{ id: number; nombre: string }>;
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  objetivos: string[];
  criterios: string[];
  observaciones?: string;
};

type OnboardingImageProps = {
  aval: Aval;
  formData: FormData;
  currentStep: number;
};

function getTotalParticipants(formData: FormData) {
  return formData.deportistas.length + formData.entrenadores.length;
}

function getTotalPresupuesto(aval: Aval) {
  const presupuestoItems = aval.evento?.presupuesto || [];
  return presupuestoItems.reduce((sum, item) => {
    const valor = parseFloat(item.presupuesto) || 0;
    return sum + valor;
  }, 0);
}

export default function OnboardingImage({ aval, formData, currentStep }: OnboardingImageProps) {
  const evento = aval.evento;

  return (
    <div className="w-full max-w-lg">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Vista Previa del Aval
          </h2>
          <p className="text-white/80 text-lg">
            Completa cada paso para ver el resumen del aval técnico.
          </p>
        </div>

        {/* Event info card */}
        {evento && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <p className="text-sm text-white/70 mb-2">Evento:</p>
            <h3 className="text-xl font-semibold text-white mb-4 line-clamp-2">
              {evento.nombre}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/90">
                <Calendar className="w-5 h-5 text-white/60" />
                <span className="text-sm">
                  {formatDateRange(evento.fechaInicio, evento.fechaFin)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <MapPin className="w-5 h-5 text-white/60" />
                <span className="text-sm">
                  {formatLocationWithProvince(evento)}
                </span>
              </div>
            </div>

            {/* Disciplina no disponible en EventoSimple */}
          </div>
        )}

        {/* Participantes Preview */}
        {(formData.deportistas.length > 0 || formData.entrenadores.length > 0) && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-white/60" />
              <p className="text-sm font-medium text-white/90">Participantes</p>
            </div>
            <div className="space-y-3">
              {formData.deportistas.length > 0 && (
                <div>
                  <p className="text-sm text-white/70 mb-1">Deportistas:</p>
                  <p className="text-lg text-white font-semibold">
                    {formData.deportistas.length} seleccionados
                  </p>
                </div>
              )}
              {formData.entrenadores.length > 0 && (
                <div>
                  <p className="text-sm text-white/70 mb-1">Entrenadores:</p>
                  <p className="text-lg text-white font-semibold">
                    {formData.entrenadores.length} seleccionados
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logística Preview */}
        {(formData.fechaHoraSalida || formData.fechaHoraRetorno) && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-white/60" />
              <p className="text-sm font-medium text-white/90">Logística</p>
            </div>
            <div className="space-y-3">
              {formData.fechaHoraSalida && (
                <div>
                  <p className="text-sm text-white/70 mb-1">Salida:</p>
                  <p className="text-white font-medium">
                    {formatDateTime(formData.fechaHoraSalida)}
                  </p>
                  {formData.transporteSalida && (
                    <p className="text-white/80 text-sm mt-1">
                      {formData.transporteSalida}
                    </p>
                  )}
                </div>
              )}
              {formData.fechaHoraRetorno && (
                <div>
                  <p className="text-sm text-white/70 mb-1">Retorno:</p>
                  <p className="text-white font-medium">
                    {formatDateTime(formData.fechaHoraRetorno)}
                  </p>
                  {formData.transporteRetorno && (
                    <p className="text-white/80 text-sm mt-1">
                      {formData.transporteRetorno}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Objetivos y Criterios Preview */}
        {(formData.objetivos.length > 0 || formData.criterios.length > 0) && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-white/60" />
              <p className="text-sm font-medium text-white/90">Objetivos y Criterios</p>
            </div>
            <div className="space-y-3">
              {formData.objetivos.length > 0 && (
                <div>
                  <p className="text-sm text-white/70 mb-1">Objetivos:</p>
                  <p className="text-lg text-white font-semibold">
                    {formData.objetivos.length} definidos
                  </p>
                </div>
              )}
              {formData.criterios.length > 0 && (
                <div>
                  <p className="text-sm text-white/70 mb-1">Criterios:</p>
                  <p className="text-lg text-white font-semibold">
                    {formData.criterios.length} definidos
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Presupuesto Preview */}
        {currentStep >= 4 && (aval.evento?.presupuesto?.length ?? 0) > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-white/60" />
              <p className="text-sm font-medium text-white/90">Presupuesto del Evento</p>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-2">Total:</p>
              <p className="text-3xl text-white font-bold">
                {formatCurrency(getTotalPresupuesto(aval))}
              </p>
              <p className="text-sm text-white/80 mt-2">
                {aval.evento.presupuesto!.length} {aval.evento.presupuesto!.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
