import { apiFetch } from "@/lib/api/client";
import type {
  Aval,
  AvalFilters,
  AvalesResponse,
  CreateAvalInput,
  UpdateAvalInput,
} from "@/types/aval";

/**
 * Lista todos los avales (Admin/SuperAdmin)
 */
export async function listAvales(filters?: AvalFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.disciplinaId) params.append("disciplinaId", String(filters.disciplinaId));
  if (filters?.categoriaId) params.append("categoriaId", String(filters.categoriaId));
  if (filters?.entrenadorId) params.append("entrenadorId", String(filters.entrenadorId));
  if (filters?.fechaDesde) params.append("fechaDesde", filters.fechaDesde);
  if (filters?.fechaHasta) params.append("fechaHasta", filters.fechaHasta);

  const query = params.toString();
  return apiFetch<Aval[]>(`/avales${query ? `?${query}` : ""}`);
}

/**
 * Lista los avales del entrenador autenticado
 */
export async function listMisAvales(filters?: AvalFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.disciplinaId) params.append("disciplinaId", String(filters.disciplinaId));

  const query = params.toString();
  return apiFetch<Aval[]>(`/avales/mis-avales${query ? `?${query}` : ""}`);
}

/**
 * Lista avales pendientes de revisión (DTM/PDA)
 */
export async function listAvalesPendientes() {
  return apiFetch<Aval[]>("/avales/pendientes");
}

/**
 * Lista historial de avales revisados por el usuario
 */
export async function listAvalesHistorial() {
  return apiFetch<Aval[]>("/avales/historial");
}

/**
 * Obtiene un aval por ID
 */
export async function getAval(id: number) {
  return apiFetch<Aval>(`/avales/${id}`);
}

/**
 * Crea un nuevo aval (Entrenador)
 */
export async function createAval(data: CreateAvalInput) {
  return apiFetch<Aval>("/avales", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza un aval existente (solo BORRADOR/DEVUELTO)
 */
export async function updateAval(id: number, data: UpdateAvalInput) {
  return apiFetch<Aval>(`/avales/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina un aval (solo BORRADOR)
 */
export async function deleteAval(id: number) {
  return apiFetch<void>(`/avales/${id}`, {
    method: "DELETE",
  });
}

/**
 * Envía un aval para revisión
 */
export async function enviarAval(id: number) {
  return apiFetch<Aval>(`/avales/${id}/enviar`, {
    method: "POST",
  });
}

/**
 * Aprueba un aval (Revisor)
 */
export async function aprobarAval(id: number, observaciones?: string) {
  return apiFetch<Aval>(`/avales/${id}/aprobar`, {
    method: "POST",
    body: JSON.stringify({ observaciones }),
  });
}

/**
 * Devuelve un aval con observaciones (Revisor)
 */
export async function devolverAval(id: number, observaciones: string) {
  return apiFetch<Aval>(`/avales/${id}/devolver`, {
    method: "POST",
    body: JSON.stringify({ observaciones }),
  });
}

/**
 * Rechaza un aval definitivamente (Revisor)
 */
export async function rechazarAval(id: number, observaciones: string) {
  return apiFetch<Aval>(`/avales/${id}/rechazar`, {
    method: "POST",
    body: JSON.stringify({ observaciones }),
  });
}
