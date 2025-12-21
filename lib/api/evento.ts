import { apiFetch } from "@/lib/api/client";
import type {
  Evento,
  EventoFilters,
  CreateEventoInput,
  CreateSolicitudAvalInput,
  ApproveRejectInput,
} from "@/types/evento";

/**
 * Lista eventos paginados
 * Retorna: { data: Evento[], meta: { page, limit, total } }
 */
export async function listEventos(filters?: EventoFilters) {
  const params = new URLSearchParams();
  if (filters?.estado) params.append("estado", filters.estado);
  if (filters?.disciplinaId) params.append("disciplinaId", String(filters.disciplinaId));
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const query = params.toString();
  // El backend retorna: { status, message, data: Evento[], meta: { page, limit, total } }
  return apiFetch<Evento[]>(`/events/paginated${query ? `?${query}` : ""}`);
}

/**
 * Obtiene un evento por ID
 */
export async function getEvento(id: number) {
  return apiFetch<Evento>(`/events/${id}`);
}

/**
 * Crea un nuevo evento
 */
export async function createEvento(data: CreateEventoInput) {
  return apiFetch<Evento>("/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza un evento existente
 */
export async function updateEvento(id: number, data: Partial<CreateEventoInput>) {
  return apiFetch<Evento>(`/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina un evento
 */
export async function deleteEvento(id: number) {
  return apiFetch<void>(`/events/${id}`, {
    method: "DELETE",
  });
}

/**
 * Solicita aval para un evento (crea ColeccionAval + AvalTecnico)
 */
export async function solicitarAval(eventoId: number, data: CreateSolicitudAvalInput) {
  return apiFetch<Evento>(`/events/${eventoId}/aval`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Aprueba un evento/aval
 */
export async function aprobarEvento(id: number, data: ApproveRejectInput) {
  return apiFetch<Evento>(`/events/${id}/aprobar`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Rechaza un evento/aval
 */
export async function rechazarEvento(id: number, data: ApproveRejectInput) {
  return apiFetch<Evento>(`/events/${id}/rechazar`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
