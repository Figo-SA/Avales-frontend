import type { User } from "@/types/user";

export type Estado = "DISPONIBLE" | "BORRADOR" | "SOLICITADO" | "RECHAZADO" | "ACEPTADO";

export type EtapaFlujo =
  | "SOLICITUD"
  | "REVISION_DTM"
  | "PDA"
  | "CONTROL_PREVIO"
  | "SECRETARIA"
  | "FINANCIERO";

export type Genero = "MASCULINO" | "FEMENINO" | "MASCULINO_FEMENINO";

export type CatalogItemSimple = {
  id: number;
  nombre: string;
};

export type ActividadSimple = {
  id: number;
  nombre: string;
  numero: number;
};

export type ItemSimple = {
  id: number;
  nombre: string;
  numero: number;
  actividad: ActividadSimple;
};

export type PresupuestoItem = {
  id: number;
  item: ItemSimple;
  mes: number;
  presupuesto: string;
  createdAt: string;
  updatedAt: string;
};

export type EventoSimple = {
  id: number;
  codigo: string;
  nombre: string;
  tipoParticipacion: string;
  tipoEvento: string;
  lugar: string;
  genero: Genero;
  disciplina: CatalogItemSimple;
  categoria: CatalogItemSimple;
  provincia: string;
  ciudad: string;
  pais: string;
  alcance: string;
  fechaInicio: string;
  fechaFin: string;
  numEntrenadoresHombres: number;
  numEntrenadoresMujeres: number;
  numAtletasHombres: number;
  numAtletasMujeres: number;
  estado: Estado;
  archivo?: string;
  presupuesto: PresupuestoItem[];
  createdAt: string;
  updatedAt: string;
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
  deportistas: DeportistaAvalDto[];
  entrenadores: EntrenadorAvalDto[];
  observaciones?: string;
};
