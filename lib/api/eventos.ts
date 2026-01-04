import { apiFetch } from "@/lib/api/client";
import type { Evento, EventoListResponse } from "@/types/evento";

export type ListEventosOptions = {
  page?: number;
  limit?: number;
  estado?: string;
  search?: string;
};

export async function listEventos(options: ListEventosOptions = {}) {
  const params = new URLSearchParams();

  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.estado) params.set("estado", options.estado);
  if (options.search) params.set("search", options.search);

  const qs = params.toString();
  const url = qs ? `/events?${qs}` : "/events";

  return apiFetch<EventoListResponse>(url, { method: "GET" });
}
