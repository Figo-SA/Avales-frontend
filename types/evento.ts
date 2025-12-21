import type { CatalogItem } from "./catalog";

/**
 * Estados posibles de un evento/aval
 * Coincide con el enum Estado del backend
 */
export type EventoStatus = "DISPONIBLE" | "SOLICITADO" | "RECHAZADO" | "ACEPTADO";

/**
 * Género del evento
 */
export type Genero = "MASCULINO" | "FEMENINO" | "MASCULINO_FEMENINO";

/**
 * Evento deportivo (entidad principal del sistema de avales)
 */
export type Evento = {
  id: number;
  codigo: string;
  tipoParticipacion: string;
  tipoEvento: string;
  nombre: string;
  lugar: string;
  genero: Genero;
  disciplinaId: number;
  disciplina?: CatalogItem;
  categoriaId: number;
  categoria?: CatalogItem;
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
  estado: EventoStatus;
  archivo?: string;
  createdAt: string;
  updatedAt: string;
  // Relación con la colección de aval (si existe)
  coleccion?: ColeccionAval;
};

/**
 * Colección de aval (creada al solicitar aval para un evento)
 */
export type ColeccionAval = {
  id: number;
  eventoId: number;
  descripcion?: string;
  estado: EventoStatus;
  comentario?: string;
  solicitudUrl?: string;
  dtmUrl?: string;
  pdaUrl?: string;
  aval?: string;
  avalTecnico?: AvalTecnico;
  entrenadores?: ColeccionEntrenador[];
  createdAt: string;
  updatedAt: string;
};

/**
 * Aval técnico (detalles de la solicitud)
 */
export type AvalTecnico = {
  id: number;
  coleccionAvalId: number;
  descripcion?: string;
  archivo?: string;
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  entrenadores: number;
  atletas: number;
  observaciones?: string;
  objetivos?: AvalObjetivo[];
  criterios?: AvalCriterio[];
  requerimientos?: AvalRequerimiento[];
  deportistasAval?: DeportistaAval[];
  createdAt: string;
  updatedAt: string;
};

/**
 * Objetivo del aval
 */
export type AvalObjetivo = {
  id: number;
  avalTecnicoId: number;
  orden: number;
  descripcion: string;
};

/**
 * Criterio de selección
 */
export type AvalCriterio = {
  id: number;
  avalTecnicoId: number;
  orden: number;
  descripcion: string;
};

/**
 * Requerimiento presupuestario
 */
export type AvalRequerimiento = {
  id: number;
  avalTecnicoId: number;
  rubroId: number;
  rubro?: { id: number; nombre: string };
  cantidadDias: string;
  valorUnitario?: number;
};

/**
 * Deportista incluido en un aval
 */
export type DeportistaAval = {
  id: number;
  avalTecnicoId: number;
  deportistaId: number;
  deportista?: {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    genero: Genero;
  };
  rol: string;
};

/**
 * Entrenador asignado a la colección
 */
export type ColeccionEntrenador = {
  id: number;
  coleccionAvalId: number;
  entrenadorId: number;
  entrenador?: {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
  };
  rol: string;
  esPrincipal: boolean;
};

/**
 * Datos para crear un evento
 */
export type CreateEventoInput = {
  codigo: string;
  tipoParticipacion: string;
  tipoEvento: string;
  nombre: string;
  lugar: string;
  genero: Genero;
  disciplinaId: number;
  categoriaId: number;
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
};

/**
 * Datos para solicitar un aval
 */
export type CreateSolicitudAvalInput = {
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  objetivos: { orden: number; descripcion: string }[];
  criterios: { orden: number; descripcion: string }[];
  rubros: { rubroId: number; cantidadDias: string; valorUnitario?: number }[];
  deportistas: { deportistaId: number; rol: string }[];
  entrenadores: { entrenadorId: number; rol: string; esPrincipal?: boolean }[];
  observaciones?: string;
};

/**
 * Datos para aprobar/rechazar un aval
 */
export type ApproveRejectInput = {
  usuarioId: number;
  motivo?: string;
};

/**
 * Filtros para listar eventos
 */
export type EventoFilters = {
  estado?: EventoStatus;
  search?: string;
  page?: number;
  limit?: number;
};

/**
 * Respuesta paginada
 */
export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};
