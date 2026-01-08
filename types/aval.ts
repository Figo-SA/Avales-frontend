import type { User } from "@/types/user";

export type Estado = "DISPONIBLE" | "BORRADOR" | "SOLICITADO" | "RECHAZADO" | "ACEPTADO";

export type EtapaFlujo =
  | "SOLICITUD"
  | "REVISION_DTM"
  | "PDA"
  | "CONTROL_PREVIO"
  | "SECRETARIA"
  | "FINANCIERO";

export type EventoSimple = {
  id: number;
  codigo: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  ciudad: string;
  pais: string;
  numEntrenadoresHombres: number;
  numEntrenadoresMujeres: number;
  numAtletasHombres: number;
  numAtletasMujeres: number;
};

export type AvalObjetivo = {
  id: number;
  orden: number;
  descripcion: string;
};

export type AvalCriterio = {
  id: number;
  orden: number;
  descripcion: string;
};

export type RubroPresupuestario = {
  id: number;
  rubroId: number;
  cantidadDias: string;
  valorUnitario?: number | null;
};

export type DeportistaAval = {
  id: number;
  deportistaId: number;
  rol: string;
};

export type EntrenadorAval = {
  id: number;
  entrenadorId: number;
  rol: string;
  esPrincipal?: boolean;
};

export type AvalTecnico = {
  id: number;
  descripcion?: string | null;
  archivo?: string | null;
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  entrenadores: number;
  atletas: number;
  observaciones?: string | null;
  objetivos: AvalObjetivo[];
  criterios: AvalCriterio[];
  requerimientos: RubroPresupuestario[];
  deportistasAval: DeportistaAval[];
};

export type UsuarioSimple = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
};

export type Historial = {
  id: number;
  estado: Estado;
  etapa: EtapaFlujo;
  comentario?: string | null;
  usuario: UsuarioSimple;
  createdAt: string;
};

export type Aval = {
  id: number;
  descripcion?: string | null;
  estado: Estado;
  comentario?: string | null;
  convocatoriaUrl?: string | null;
  dtmUrl?: string | null;
  pdaUrl?: string | null;
  solicitudUrl?: string | null;
  aval?: string | null;
  evento: EventoSimple;
  avalTecnico?: AvalTecnico;
  entrenadores: EntrenadorAval[];
  historial: Historial[];
  createdAt: string;
  updatedAt: string;
};

// La API devuelve el array directamente en data, y la paginación en meta
export type AvalListResponse = Aval[];

export type ObjetivoDto = {
  orden: number;
  descripcion: string;
};

export type CriterioDto = {
  orden: number;
  descripcion: string;
};

export type RubroPresupuestarioDto = {
  rubroId: number;
  cantidadDias: string;
  valorUnitario?: number;
};

export type DeportistaAvalDto = {
  deportistaId: number;
  rol: string;
};

export type EntrenadorAvalDto = {
  entrenadorId: number;
  rol: string;
  esPrincipal?: boolean;
};

export type CreateAvalPayload = {
  coleccionAvalId: number;
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  objetivos: ObjetivoDto[];
  criterios: CriterioDto[];
  rubros: RubroPresupuestarioDto[];
  deportistas: DeportistaAvalDto[];
  entrenadores: EntrenadorAvalDto[];
  observaciones?: string;
};
