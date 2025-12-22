import type { CatalogItem } from "@/types/catalog";

export type Evento = {
  id: number;
  codigo: string;
  nombre: string;
  tipoParticipacion?: string | null;
  tipoEvento?: string | null;
  lugar?: string | null;
  provincia?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  genero?: string | null;
  alcance?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  numEntrenadoresHombres?: number | null;
  numEntrenadoresMujeres?: number | null;
  numAtletasHombres?: number | null;
  numAtletasMujeres?: number | null;
  estado?: string | null;
  archivo?: string | null;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  disciplina?: CatalogItem | null;
  disciplinaId?: number;
  categoria?: CatalogItem | null;
  categoriaId?: number;
};

export type EventoListResponse = Evento[];
