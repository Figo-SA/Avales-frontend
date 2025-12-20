import type { User } from "./user";
import type { CatalogItem } from "./catalog";

/**
 * Deportista registrado en el sistema
 */
export type Deportista = {
  id: number;
  userId: number;
  user?: User;
  cedula: string;
  fechaNacimiento: string;
  genero?: "M" | "F";
  telefono?: string;
  direccion?: string;
  categoriaId: number;
  categoria?: CatalogItem;
  disciplinaId: number;
  disciplina?: CatalogItem;
  entrenadorId?: number;
  entrenador?: User;
  clubId?: number;
  club?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Datos para crear un deportista
 */
export type CreateDeportistaInput = {
  userId?: number;
  nombre: string;
  apellido: string;
  email: string;
  cedula: string;
  fechaNacimiento: string;
  genero?: "M" | "F";
  telefono?: string;
  direccion?: string;
  categoriaId: number;
  disciplinaId: number;
  entrenadorId?: number;
  clubId?: number;
};

/**
 * Datos para actualizar un deportista
 */
export type UpdateDeportistaInput = Partial<CreateDeportistaInput> & {
  activo?: boolean;
};

/**
 * Filtros para listar deportistas
 */
export type DeportistaFilters = {
  categoriaId?: number;
  disciplinaId?: number;
  entrenadorId?: number;
  activo?: boolean;
  search?: string;
};

/**
 * Respuesta paginada de deportistas
 */
export type DeportistasResponse = {
  data: Deportista[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
