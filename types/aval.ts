import type { User } from "./user";
import type { CatalogItem } from "./catalog";
import type { Deportista } from "./deportista";

/**
 * Estados posibles de un aval
 */
export type AvalStatus =
  | "BORRADOR"
  | "ENVIADO"
  | "EN_REVISION"
  | "APROBADO"
  | "DEVUELTO"
  | "RECHAZADO";

/**
 * Tipos de documentos que componen un aval
 */
export type TipoDocumento =
  | "SOLICITUD_INICIAL"
  | "CERTIFICADO_MEDICO"
  | "FICHA_DEPORTISTA"
  | "APROBACION_DTM"
  | "APROBACION_PDA"
  | "DOCUMENTO_FINAL";

/**
 * Estado de un documento individual
 */
export type DocumentoStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO";

/**
 * Documento que forma parte de un aval
 */
export type DocumentoAval = {
  id: number;
  avalId: number;
  tipo: TipoDocumento;
  nombre: string;
  url?: string;
  status: DocumentoStatus;
  orden: number;
  aprobadoPorId?: number;
  aprobadoPor?: User;
  fechaAprobacion?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Historial de cambios de estado del aval
 */
export type AvalHistorial = {
  id: number;
  avalId: number;
  statusAnterior: AvalStatus;
  statusNuevo: AvalStatus;
  usuarioId: number;
  usuario?: User;
  observaciones?: string;
  fecha: string;
};

/**
 * Aval deportivo principal
 */
export type Aval = {
  id: number;
  codigo: string;
  status: AvalStatus;
  entrenadorId: number;
  entrenador?: User;
  disciplinaId: number;
  disciplina?: CatalogItem;
  categoriaId: number;
  categoria?: CatalogItem;
  deportistas: Deportista[];
  documentos?: DocumentoAval[];
  historial?: AvalHistorial[];
  observaciones?: string;
  fechaEnvio?: string;
  fechaAprobacion?: string;
  aprobadoPorId?: number;
  aprobadoPor?: User;
  createdAt: string;
  updatedAt: string;
};

/**
 * Datos para crear un nuevo aval
 */
export type CreateAvalInput = {
  disciplinaId: number;
  categoriaId: number;
  deportistaIds: number[];
  observaciones?: string;
};

/**
 * Datos para actualizar un aval
 */
export type UpdateAvalInput = Partial<CreateAvalInput>;

/**
 * Filtros para listar avales
 */
export type AvalFilters = {
  status?: AvalStatus;
  disciplinaId?: number;
  categoriaId?: number;
  entrenadorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

/**
 * Respuesta paginada de avales
 */
export type AvalesResponse = {
  data: Aval[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
