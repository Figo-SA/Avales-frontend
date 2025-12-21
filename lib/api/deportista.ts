import { apiFetch } from "@/lib/api/client";
import type {
  Deportista,
  DeportistaListItem,
  DeportistaFilters,
  DeportistasPaginatedResponse,
  CreateDeportistaInput,
  UpdateDeportistaInput,
} from "@/types/deportista";

/**
 * Lista deportistas con paginación y filtros
 */
export async function listDeportistas(filters?: DeportistaFilters) {
  const params = new URLSearchParams();
  if (filters?.sexo) params.append("sexo", filters.sexo);
  if (filters?.query) params.append("query", filters.query);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const query = params.toString();
  return apiFetch<DeportistasPaginatedResponse>(`/deportistas${query ? `?${query}` : ""}`);
}

/**
 * Busca un deportista por cédula
 */
export async function buscarDeportistaPorCedula(cedula: string) {
  return apiFetch<DeportistaListItem>(`/deportistas/buscar/cedula?cedula=${encodeURIComponent(cedula)}`);
}

/**
 * Obtiene un deportista por ID (respuesta detallada)
 */
export async function getDeportista(id: number) {
  return apiFetch<Deportista>(`/deportistas/${id}`);
}

/**
 * Crea un nuevo deportista
 */
export async function createDeportista(data: CreateDeportistaInput) {
  return apiFetch<Deportista>("/deportistas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza un deportista existente
 */
export async function updateDeportista(id: number, data: UpdateDeportistaInput) {
  return apiFetch<Deportista>(`/deportistas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina un deportista (soft delete)
 */
export async function deleteDeportista(id: number) {
  return apiFetch<void>(`/deportistas/${id}`, {
    method: "DELETE",
  });
}
