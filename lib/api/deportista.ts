import { apiFetch } from "@/lib/api/client";
import type {
  Deportista,
  DeportistaFilters,
  CreateDeportistaInput,
  UpdateDeportistaInput,
} from "@/types/deportista";

/**
 * Lista todos los deportistas (Admin)
 */
export async function listDeportistas(filters?: DeportistaFilters) {
  const params = new URLSearchParams();
  if (filters?.categoriaId) params.append("categoriaId", String(filters.categoriaId));
  if (filters?.disciplinaId) params.append("disciplinaId", String(filters.disciplinaId));
  if (filters?.entrenadorId) params.append("entrenadorId", String(filters.entrenadorId));
  if (filters?.activo !== undefined) params.append("activo", String(filters.activo));
  if (filters?.search) params.append("search", filters.search);

  const query = params.toString();
  return apiFetch<Deportista[]>(`/deportistas${query ? `?${query}` : ""}`);
}

/**
 * Lista deportistas asignados al entrenador autenticado
 */
export async function listMisDeportistas(filters?: DeportistaFilters) {
  const params = new URLSearchParams();
  if (filters?.categoriaId) params.append("categoriaId", String(filters.categoriaId));
  if (filters?.disciplinaId) params.append("disciplinaId", String(filters.disciplinaId));
  if (filters?.search) params.append("search", filters.search);

  const query = params.toString();
  return apiFetch<Deportista[]>(`/deportistas/mis-deportistas${query ? `?${query}` : ""}`);
}

/**
 * Obtiene un deportista por ID
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
 * Elimina un deportista
 */
export async function deleteDeportista(id: number) {
  return apiFetch<void>(`/deportistas/${id}`, {
    method: "DELETE",
  });
}
