import type { CatalogItem } from "./catalog";

/**
 * Género del deportista
 */
export type DeportistaGenero = "MASCULINO" | "FEMENINO" | "MASCULINO_FEMENINO";

/**
 * Deportista registrado en el sistema
 * Coincide con DeportistaResponseDto del backend
 */
export type Deportista = {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  genero: DeportistaGenero;
  categoriaId?: number;
  categoria?: CatalogItem;
  disciplinaId?: number;
  disciplina?: CatalogItem;
  afiliacion: boolean;
  afiliacionInicio?: string;
  afiliacionFin?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Respuesta simplificada para listas (ParticipantResponseDto)
 */
export type DeportistaListItem = {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  sexo?: string;
  fechaNacimiento: string;
  club?: string;
  afiliacion: boolean;
  afiliacionInicio?: string;
  afiliacionFin?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Datos para crear un deportista
 */
export type CreateDeportistaInput = {
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  genero: DeportistaGenero;
  categoriaId: number;
  disciplinaId: number;
};

/**
 * Datos para actualizar un deportista
 */
export type UpdateDeportistaInput = Partial<CreateDeportistaInput> & {
  afiliacion?: boolean;
};

/**
 * Filtros para listar deportistas
 */
export type DeportistaFilters = {
  sexo?: string;
  query?: string;
  page?: number;
  limit?: number;
};

/**
 * Respuesta paginada de deportistas
 */
export type DeportistasPaginatedResponse = {
  items: DeportistaListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};
