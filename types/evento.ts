import type { CatalogItem } from "@/types/catalog";

export type EventoGenero = "MASCULINO" | "FEMENINO" | "MASCULINO_FEMENINO";
export type EventoEstado = "DISPONIBLE" | "SOLICITADO" | "RECHAZADO" | "ACEPTADO";

export type Evento = {
  id: number;
  codigo: string;
  nombre: string;
  tipoParticipacion: string;
  tipoEvento: string;
  lugar: string;
  provincia: string;
  ciudad: string;
  pais: string;
  genero: EventoGenero;
  alcance: string;
  fechaInicio: string;
  fechaFin: string;
  numEntrenadoresHombres: number;
  numEntrenadoresMujeres: number;
  numAtletasHombres: number;
  numAtletasMujeres: number;
  estado?: EventoEstado | null;
  archivo?: string | null;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  disciplina?: CatalogItem | null;
  disciplinaId: number;
  categoria?: CatalogItem | null;
  categoriaId: number;
};

export type EventoListResponse = {
  data: Evento[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};
