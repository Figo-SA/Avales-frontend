import { apiFetch } from "@/lib/api/client";
import type { Evento, EventoListResponse } from "@/types/evento";

export async function listEventos() {
  return apiFetch<EventoListResponse>("/events", { method: "GET" });
}
