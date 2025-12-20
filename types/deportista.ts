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

export type DeportistaListResponse = Deportista[];
