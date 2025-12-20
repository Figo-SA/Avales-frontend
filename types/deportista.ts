import type { CatalogItem } from "@/types/catalog";

export type Deportista = {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento?: string;
  categoria?: CatalogItem;
  disciplina?: CatalogItem;
  genero?: string;
  afiliacion: boolean;
  afiliacionInicio?: string | null;
  afiliacionFin?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: Pagination;
};

export type DeportistaListResponse = PaginatedResult<Deportista>;
